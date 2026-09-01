import 'dotenv/config';

import bcrypt from 'bcryptjs';
import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

import jwt, {
  type JwtPayload,
} from 'jsonwebtoken';

import multer from 'multer';
import {
  v2 as cloudinary,
  type UploadApiResponse,
} from 'cloudinary';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is missing from the environment.'
  );
}

if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is missing from the environment.'
  );
}

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    'Cloudinary environment variables are required.'
  );
}

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,

  secure: true,
});


const JWT_SECRET = process.env.JWT_SECRET;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});


const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (
    _req,
    file,
    callback
  ) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      callback(null, true);
      return;
    }

    callback(
      new Error(
        'Only JPEG, PNG, and WEBP images are allowed.'
      )
    );
  },
});


function uploadImageToCloudinary(
  buffer: Buffer
): Promise<UploadApiResponse> {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              'retrieveid/student-ids',

            resource_type: 'image',

            type: 'authenticated',
          },

          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(
                new Error(
                  'Cloudinary did not return an upload result.'
                )
              );
              return;
            }

            resolve(result);
          }
        );

      uploadStream.end(buffer);
    }
  );
}

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader =
    req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      success: false,
      message:
        'Authentication token is required.',
    });
  }

  const [scheme, token] =
    authorizationHeader.split(' ');

  if (
    scheme !== 'Bearer' ||
    !token
  ) {
    return res.status(401).json({
      success: false,
      message:
        'Invalid authentication token format.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET,
      {
        algorithms: ['HS256'],
      }
    );

    if (
      typeof decoded === 'string' ||
      !decoded.userId
    ) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid authentication token.',
      });
    }

    res.locals.userId =
      String(decoded.userId);

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message:
        'Invalid or expired authentication token.',
    });
  }
};

app.use(cors());
app.use(express.json());

app.get(
  '/',
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'RetrieveID API is running.',
    });
  }
);

app.get(
  '/api/health',
  async (req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      res.status(200).json({
        success: true,
        message:
          'RetrieveID backend and PostgreSQL database are healthy.',
      });
    } catch (error) {
      console.error(
        'Database health check failed:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Database connection failed.',
      });
    }
  }
);

app.post(
  '/api/auth/register',
  async (req: Request, res: Response) => {
    try {
      const {
        fullName,
        studentId,
        email,
        phone,
        password,
      } = req.body;

      // Check required fields.
      if (
        !fullName ||
        !studentId ||
        !email ||
        !phone ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required.',
        });
      }

      // Validate Student ID.
      if (!/^\d{8}$/.test(studentId)) {
        return res.status(400).json({
          success: false,
          message:
            'Student ID must contain exactly 8 digits.',
        });
      }

      // Validate email.
      const normalizedEmail =
        String(email).trim().toLowerCase();

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          normalizedEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Please provide a valid email address.',
        });
      }

      // Validate password.
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            'Password must contain at least 6 characters.',
        });
      }

      if (
        Buffer.byteLength(password, 'utf8') > 72
      ) {
        return res.status(400).json({
          success: false,
          message: 'Password is too long.',
        });
      }

      // Check whether the email already exists.
      const existingEmail =
        await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message:
            'An account with this email already exists.',
        });
      }

      // Check whether the Student ID is already linked.
      const existingStudentId =
        await prisma.user.findUnique({
          where: {
            studentId,
          },
        });

      if (existingStudentId) {
        return res.status(409).json({
          success: false,
          message:
            'This Student ID is already linked to an account.',
        });
      }

      // Hash the password before storing it.
      const passwordHash =
        await bcrypt.hash(password, 12);

      // Create the user in PostgreSQL.
      const user = await prisma.user.create({
        data: {
          fullName: String(fullName).trim(),
          studentId,
          email: normalizedEmail,
          phone: String(phone).trim(),
          passwordHash,
        },
        select: {
          id: true,
          fullName: true,
          studentId: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        user,
      });
    } catch (error) {
      console.error(
        'Registration error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to create account at this time.',
      });
    }
  }
);

app.post(
  '/api/auth/login',
  async (req: Request, res: Response) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message:
            'Email and password are required.',
        });
      }

      const normalizedEmail =
        String(email).trim().toLowerCase();

      const user =
        await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            'Invalid email or password.',
        });
      }

      const passwordMatches =
        await bcrypt.compare(
          String(password),
          user.passwordHash
        );

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message:
            'Invalid email or password.',
        });
      }

      const token = jwt.sign(
        {
          userId: user.id,
        },
        JWT_SECRET,
        {
          expiresIn: '7d',
          algorithm: 'HS256',
        }
      );

      return res.status(200).json({
          success: true,
          message: 'Login successful.',
          token,
          user: {
          id: user.id,
          fullName: user.fullName,
          studentId: user.studentId,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error(
        'Login error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to log in at this time.',
      });
    }
  }
);

app.get(
  '/api/auth/me',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId =
        res.locals.userId as string;

      const user =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            fullName: true,
            studentId: true,
            email: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error(
        'Get profile error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve user profile.',
      });
    }
  }
);

app.patch(
  '/api/auth/me',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId =
        res.locals.userId as string;

      const {
        fullName,
        email,
        phone,
      } = req.body;

      if (
        !fullName ||
        !email ||
        !phone
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Full name, email, and phone number are required.',
        });
      }

      const normalizedName =
        String(fullName).trim();

      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      const normalizedPhone =
        String(phone).trim();

      if (normalizedName.length < 3) {
        return res.status(400).json({
          success: false,
          message:
            'Please provide a valid full name.',
        });
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          normalizedEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Please provide a valid email address.',
        });
      }

      const phoneDigits =
        normalizedPhone.replace(/\D/g, '');

      if (
        phoneDigits.length < 10 ||
        phoneDigits.length > 15
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Please provide a valid phone number.',
        });
      }

      const existingEmail =
        await prisma.user.findFirst({
          where: {
            email: normalizedEmail,
            NOT: {
              id: userId,
            },
          },
          select: {
            id: true,
          },
        });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message:
            'Another account is already using this email address.',
        });
      }

      const existingUser =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }

      const updatedUser =
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            fullName: normalizedName,
            email: normalizedEmail,
            phone: normalizedPhone,
          },
          select: {
            id: true,
            fullName: true,
            studentId: true,
            email: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
        });

      return res.status(200).json({
        success: true,
        message:
          'Profile updated successfully.',
        user: updatedUser,
      });
    } catch (error) {
      console.error(
        'Update profile error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to update your profile at this time.',
      });
    }
  }
);

app.post(
  '/api/reports',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId =
        res.locals.userId as string;

      const {
        studentId,
        foundLocation,
        retrievalLocation,
        imageUrl,
        imagePublicId,
        finderContact,
      } = req.body;


      if (
        !studentId ||
        !foundLocation ||
        !retrievalLocation
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Student ID, found location, and retrieval location are required.',
        });
      }

      const normalizedStudentId =
        String(studentId).trim();

      if (
        !/^\d{8}$/.test(
          normalizedStudentId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Student ID must contain exactly 8 digits.',
        });
      }

      const result =
        await prisma.$transaction(
          async (tx) => {
            const report =
              await tx.report.create({
                data: {
                  studentId:
                    normalizedStudentId,

                  foundLocation:
                    String(
                      foundLocation
                    ).trim(),

                  retrievalLocation:
                    String(
                      retrievalLocation
                    ).trim(),

                  finderContact:
                    typeof finderContact ===
                      'string' &&
                    finderContact.trim()
                      ? finderContact.trim()
                      : null,

                  imageUrl:
                    typeof imageUrl ===
                      'string' &&
                    imageUrl.trim()
                      ? imageUrl.trim()
                      : null,

                  imagePublicId:
                    typeof imagePublicId ===
                      'string' &&
                    imagePublicId.trim()
                      ? imagePublicId.trim()
                      : null,

                  reportedById:
                    userId,
                },
              });

            const owner =
              await tx.user.findUnique({
                where: {
                  studentId:
                    normalizedStudentId,
                },

                select: {
                  id: true,
                  fullName: true,
                },
              });

            let notification = null;

            if (owner) {
              notification =
                await tx.notification.create({
                  data: {
                    title:
                      'Your Student ID has been found',

                    message:
                      `Your Student ID was reported as found at ${String(
                        foundLocation
                      ).trim()}. It can be collected from ${String(
                        retrievalLocation
                      ).trim()}.`,

                    userId:
                      owner.id,

                    reportId:
                      report.id,
                  },
                });
            }

            return {
              report,
              notification,
            };
          }
        );

      return res.status(201).json({
        success: true,

        message:
          'Found Student ID report submitted successfully.',

        report: {
          id:
            result.report.id,

          studentId:
            result.report.studentId,

          foundLocation:
            result.report.foundLocation,

          retrievalLocation:
            result.report
              .retrievalLocation,

          imageUrl:
            result.report.imageUrl,

          imagePublicId:
            result.report
              .imagePublicId,

          finderContact:
            result.report
              .finderContact,

          status:
            result.report.status,

          createdAt:
            result.report.createdAt,
        },

        notificationCreated:
          Boolean(
            result.notification
          ),
      });
    } catch (error) {
      console.error(
        'Create report error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to submit the report at this time.',
      });
    }
  }
);


app.post(
  '/api/uploads/id-image',
  authenticateToken,
  (
    req: Request,
    res: Response
  ) => {
    upload.single('image')(
      req,
      res,
      async (uploadError) => {
        if (uploadError) {
          if (
            uploadError instanceof
            multer.MulterError
          ) {
            if (
              uploadError.code ===
              'LIMIT_FILE_SIZE'
            ) {
              return res
                .status(400)
                .json({
                  message:
                    'The image must not exceed 5 MB.',
                });
            }

            return res
              .status(400)
              .json({
                message:
                  uploadError.message,
              });
          }

          return res
            .status(400)
            .json({
              message:
                uploadError.message ||
                'Unable to process the image.',
            });
        }

        if (!req.file) {
          return res
            .status(400)
            .json({
              message:
                'A Student ID image is required.',
            });
        }

        try {
          const result =
            await uploadImageToCloudinary(
              req.file.buffer
            );

          return res
            .status(201)
            .json({
              message:
                'Student ID image uploaded successfully.',

              image: {
                publicId:
                  result.public_id,

                secureUrl:
                  result.secure_url,

                format:
                  result.format,

                width:
                  result.width,

                height:
                  result.height,

                bytes:
                  result.bytes,
              },
            });
        } catch (error) {
          console.error(
            'Cloudinary upload error:',
            error
          );

          return res
            .status(500)
            .json({
              message:
                'Unable to upload the Student ID image.',
            });
        }
      }
    );
  }
);

app.get(
  '/api/reports/search/:studentId',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const studentId =
        String(req.params.studentId).trim();

      if (!/^\d{8}$/.test(studentId)) {
        return res.status(400).json({
          success: false,
          message:
            'Student ID must contain exactly 8 digits.',
        });
      }

      const report =
        await prisma.report.findFirst({
          where: {
            studentId,
            status: 'AWAITING_COLLECTION',
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            studentId: true,
            foundLocation: true,
            retrievalLocation: true,
            imageUrl: true,
            status: true,
            createdAt: true,
          },
        });

      if (!report) {
        return res.status(404).json({
          success: false,
          message:
            'No active report was found for this Student ID.',
        });
      }

      return res.status(200).json({
        success: true,
        report,
      });
    } catch (error) {
      console.error(
        'Search report error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to search for the Student ID at this time.',
      });
    }
  }
);

app.patch(
  '/api/reports/:reportId/collect',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId as string;
      const reportId = String(
        req.params.reportId
      ).trim();

      const currentUser =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            studentId: true,
          },
        });

      if (!currentUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }

      const report =
        await prisma.report.findUnique({
          where: {
            id: reportId,
          },
          select: {
            id: true,
            studentId: true,
            status: true,
          },
        });

      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found.',
        });
      }

      if (
        report.studentId !==
        currentUser.studentId
      ) {
        return res.status(403).json({
          success: false,
          message:
            'You are not authorized to mark this Student ID as collected.',
        });
      }

      if (report.status === 'COLLECTED') {
        return res.status(409).json({
          success: false,
          message:
            'This Student ID has already been marked as collected.',
        });
      }

      const updatedReport =
        await prisma.report.update({
          where: {
            id: reportId,
          },
          data: {
            status: 'COLLECTED',
            collectedAt: new Date(),
          },
          select: {
            id: true,
            studentId: true,
            foundLocation: true,
            retrievalLocation: true,
            status: true,
            collectedAt: true,
            createdAt: true,
          },
        });

      return res.status(200).json({
        success: true,
        message:
          'Student ID marked as collected successfully.',
        report: updatedReport,
      });
    } catch (error) {
      console.error(
        'Collect report error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to update the report at this time.',
      });
    }
  }
);

app.get(
  '/api/reports/:reportId/image',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId =
        res.locals.userId as string;

      const reportId = String(
        req.params.reportId
      ).trim();

      const currentUser =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            studentId: true,
          },
        });

      if (!currentUser) {
        return res.status(404).json({
          success: false,
          message:
            'User account not found.',
        });
      }

      const report =
        await prisma.report.findUnique({
          where: {
            id: reportId,
          },
          select: {
            id: true,
            studentId: true,
            reportedById: true,
            imageUrl: true,
            imagePublicId: true,
          },
        });

      if (!report) {
        return res.status(404).json({
          success: false,
          message:
            'Report not found.',
        });
      }

      const isOwner =
        currentUser.studentId ===
        report.studentId;

      const isReporter =
        report.reportedById === userId;

      if (!isOwner && !isReporter) {
        return res.status(403).json({
          success: false,
          message:
            'You are not authorized to view this Student ID image.',
        });
      }

      if (
        !report.imagePublicId ||
        !report.imageUrl
      ) {
        return res.status(404).json({
          success: false,
          message:
            'No image is available for this report.',
        });
      }

      const urlWithoutQuery =
        report.imageUrl.split('?')[0];

      const extension =
        urlWithoutQuery
          .split('.')
          .pop()
          ?.toLowerCase();

      const allowedFormats = [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ];

      const format =
        extension &&
        allowedFormats.includes(extension)
          ? extension
          : 'jpg';

      const expiresAt =
        Math.floor(Date.now() / 1000) +
        5 * 60;

      const signedImageUrl =
        cloudinary.utils.private_download_url(
          report.imagePublicId,
          format,
          {
            resource_type: 'image',
            type: 'authenticated',
            expires_at: expiresAt,
            attachment: false,
          }
        );

      return res.status(200).json({
        success: true,
        image: {
          url: signedImageUrl,
          expiresAt,
        },
      });
    } catch (error) {
      console.error(
        'Get report image error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve the Student ID image.',
      });
    }
  }
);


app.get(
  '/api/notifications',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId =
        res.locals.userId as string;

      const notifications =
        await prisma.notification.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            title: true,
            message: true,
            isRead: true,
            readAt: true,
            createdAt: true,

            report: {
              select: {
                id: true,
                studentId: true,
                foundLocation: true,
                retrievalLocation: true,
                status: true,
                createdAt: true,
              },
            },
          },
        });

      const formattedNotifications =
        notifications.map(
          (notification) => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            readAt: notification.readAt,
            createdAt: notification.createdAt,

            reportId:
              notification.report.id,

            studentId:
              notification.report.studentId,

            foundLocation:
              notification.report.foundLocation,

            retrievalLocation:
              notification.report
                .retrievalLocation,

            status:
              notification.report.status,

            dateReported:
              notification.report.createdAt,
          })
        );

      const unreadCount =
        formattedNotifications.filter(
          (notification) =>
            !notification.isRead
        ).length;

      return res.status(200).json({
        success: true,
        unreadCount,
        notifications:
          formattedNotifications,
      });
    } catch (error) {
      console.error(
        'Get notifications error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve notifications at this time.',
      });
    }
  }
);

app.patch(
  '/api/notifications/:notificationId/read',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId =
        res.locals.userId as string;

      const notificationId = String(
        req.params.notificationId
      ).trim();

      const notification =
        await prisma.notification.findFirst({
          where: {
            id: notificationId,
            userId,
          },
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found.',
        });
      }

      if (notification.isRead) {
        return res.status(200).json({
          success: true,
          message:
            'Notification is already marked as read.',
          notification,
        });
      }

      const updatedNotification =
        await prisma.notification.update({
          where: {
            id: notificationId,
          },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });

      return res.status(200).json({
        success: true,
        message:
          'Notification marked as read.',
        notification:
          updatedNotification,
      });
    } catch (error) {
      console.error(
        'Mark notification read error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to update the notification.',
      });
    }
  }
);

app.patch(
  '/api/notifications/read-all',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId =
        res.locals.userId as string;

      const now = new Date();

      const result =
        await prisma.notification.updateMany({
          where: {
            userId,
            isRead: false,
          },
          data: {
            isRead: true,
            readAt: now,
          },
        });

      return res.status(200).json({
        success: true,
        message:
          'All notifications marked as read.',
        updatedCount: result.count,
      });
    } catch (error) {
      console.error(
        'Mark all notifications read error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Unable to update notifications.',
      });
    }
  }
);



app.use(
  (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Route not found.',
    });
  }
);

app.use(
  (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error('Server error:', error);

    res.status(500).json({
      success: false,
      message:
        'An unexpected server error occurred.',
    });
  }
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `RetrieveID API is running on port ${PORT}`
  );
});