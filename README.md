# RetrieveID

## Student ID Card Recovery Mobile Application

RetrieveID is a mobile application developed to provide a more structured, secure, and efficient way of reporting and recovering lost Student Identification Cards within a university environment.

The application provides a centralized platform where users can report found Student IDs, search for lost IDs, receive notifications when their ID has been reported, view approved retrieval locations, obtain directions to retrieval points, and confirm collection after recovering their card.

RetrieveID was developed as a Final Year Project at the University of Ghana.

---

## Problem Statement

The recovery of lost Student ID cards within the university environment is often handled through informal methods such as WhatsApp groups, social media, word of mouth, and visits to different porter lodges.

Although these methods can sometimes help students recover their cards, they are fragmented and may not provide timely information about whether an ID has been found or where it has been submitted.

A student may therefore spend considerable time checking different platforms or locations without knowing whether the card has already been found.

RetrieveID addresses this problem by providing a centralized mobile platform that connects the reporting of a found Student ID with its eventual physical recovery.

---

## Project Aim

The aim of this project is to design and develop a secure and user-friendly mobile application that facilitates the efficient reporting, tracking, and recovery of lost Student ID cards within the university environment.

---

## Project Objectives

The objectives of RetrieveID are to:

- Design a simple and intuitive mobile interface for reporting and searching for Student IDs.
- Implement user registration and authentication with Student ID numbers linked to user accounts.
- Enable finders to report found Student IDs with photographs and location information.
- Store user accounts, reports, retrieval locations, and notifications in a centralized database.
- Allow users to search for reported Student IDs using the Student ID number.
- Automatically match reported Student IDs with registered user accounts.
- Notify registered owners when their Student ID is reported as found.
- Provide approved retrieval-location selection and nearest-location assistance.
- Provide directions to selected retrieval locations.
- Test the functionality, security, reliability, and usability of the system.

---

## Key Features

### User Registration and Authentication

Users can:

- Create an account.
- Log in securely.
- Link their Student ID number to their account.
- Maintain their profile information.
- Log out of the application.

### Search for a Student ID

Users can search for a lost Student ID using the Student ID number.

When an active report exists, the system displays information such as:

- Student ID number
- Location where the ID was found
- Retrieval location
- Date reported
- Current collection status

If there is no active report, the application informs the user that the Student ID has not yet been reported.

### Report a Found Student ID

Authenticated users can report a found Student ID by providing:

- A photograph of the Student ID
- Student ID number
- Confirmation of the Student ID number
- Location where the ID was found
- Selected retrieval location
- Optional finder contact information

The physical Student ID is then expected to be submitted to the selected retrieval location.

### Exact Student ID Matching

When a report is submitted, the backend checks whether the reported Student ID number matches the Student ID linked to an existing registered account.

If a matching account exists, the owner is automatically notified.

### Notifications

RetrieveID supports:

- In-app notifications
- Email notifications

These notifications inform registered users when their linked Student ID has been reported as found.

### Retrieval Locations

The application provides approved locations where found Student IDs can be submitted and retrieved.

Users can:

- View available retrieval locations.
- Select a retrieval location when submitting a report.
- Find a nearby retrieval location.
- Open directions to a retrieval location using the device's mapping application.

### Collection Confirmation

After physically retrieving the Student ID, the registered owner can confirm collection through the application.

The report status changes from:

`Awaiting Collection`

to:

`Collected`

### Secure Student ID Image Access

Student ID photographs are securely stored and are not made freely accessible to unrelated users.

Access is limited to authorized users associated with the report.

---

## How RetrieveID Works

The main recovery process is as follows:

1. A finder discovers a lost Student ID.
2. The finder logs into RetrieveID.
3. The finder uploads a photograph of the Student ID.
4. The finder enters and confirms the Student ID number.
5. The location where the ID was found is provided.
6. The finder selects an approved retrieval location.
7. The report is submitted to the backend.
8. The backend stores the report and checks for a registered account with the same Student ID number.
9. If a matching owner exists, the owner receives an in-app notification and an email notification.
10. The owner views the report and retrieval information.
11. The owner can obtain directions to the retrieval location.
12. The owner physically collects the Student ID.
13. The owner confirms collection in the application.
14. The report status is updated to `Collected`.

---

## Technologies and Tools Used

| Technology / Tool | Purpose |
|---|---|
| React Native | Development of the mobile application interface |
| Expo | Mobile application development and testing |
| Expo Router | Navigation between application screens |
| Node.js | Backend runtime environment |
| Express.js | REST API and backend services |
| TypeScript | Backend development and type safety |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and management |
| JWT | User authentication |
| Expo SecureStore | Secure storage of authentication tokens |
| Cloudinary | Secure storage of Student ID photographs |
| Nodemailer / Gmail | Email notifications |
| Expo Location | Device location functionality |
| Apple Maps / Google Maps | Directions to retrieval locations |
| Figma | User interface design and prototyping |
| Git | Version control |
| GitHub | Source-code hosting and repository management |

---

## System Architecture

RetrieveID follows a three-tier architecture consisting of the presentation layer, application layer, and data layer.

```text
┌───────────────────────────────┐
│       Mobile Application      │
│     React Native + Expo       │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│        Backend Server         │
│ Node.js + Express + TypeScript│
└───────────────┬───────────────┘
                │
                │ Prisma ORM
                ▼
┌───────────────────────────────┐
│      PostgreSQL Database      │
└───────────────────────────────┘
```

Cloudinary is used for Student ID image storage, while Nodemailer is used for email notifications.

---

## Main Database Entities

### User

Stores information about registered users, including their linked Student ID numbers.

### Report

Stores information about reported Student IDs, including:

- Student ID number
- Student ID image reference
- Location where the ID was found
- Retrieval location
- Finder information
- Date reported
- Collection status

### Notification

Stores notifications generated for users when their linked Student ID is reported as found.

---

## Security

RetrieveID includes several security measures to protect user information and Student ID data.

These include:

- Password hashing before passwords are stored in the database.
- JWT-based authentication.
- Secure authentication token storage using Expo SecureStore.
- Authentication requirements for protected backend routes.
- Authorization checks before sensitive operations are performed.
- Secure Student ID image storage using Cloudinary.
- Restricted access to Student ID photographs.
- Temporary signed image links for authorized access.
- Owner authorization before collection can be confirmed.

Sensitive credentials and environment variables are not included in the public source code.

---

## Installation and Setup

### Prerequisites

Before running RetrieveID, ensure that the following are installed:

- Node.js
- npm
- Git
- PostgreSQL
- Expo Go on a compatible Android or iOS device

The application also requires configuration for services used by the backend, including:

- PostgreSQL
- JWT authentication
- Cloudinary
- Email notifications

---

### 1. Clone or Download the Repository

Clone the repository from GitHub using the **Code** option on the repository page, or download the project as a ZIP file.

After cloning or extracting the project, open the project directory in a terminal.

---

### 2. Install Mobile Application Dependencies

From the main project directory, run:

```bash
npm install
```

---

### 3. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install the required backend dependencies:

```bash
npm install
```

---

### 4. Configure Environment Variables

The backend requires environment variables for services such as:

- PostgreSQL database connection
- JWT authentication
- Cloudinary image storage
- Email notifications

These values are stored in a backend `.env` file.

For security reasons, the `.env` file containing private credentials is not included in the GitHub repository.

The `.env` file should also remain excluded through `.gitignore`.

---

### 5. Generate Prisma Client

From the backend directory, run:

```bash
npx prisma generate
```

---

### 6. Start the Backend Server

From the backend directory, run:

```bash
npm run dev
```

---

### 7. Start the Mobile Application

Open another terminal and navigate to the main project directory.

Run:

```bash
npx expo start
```

If the mobile device cannot connect directly to the development server, Expo Tunnel can be used:

```bash
npx expo start --tunnel
```

The application can then be opened using Expo Go on a compatible Android or iOS device.

To restart Expo while clearing the development cache, run:

```bash
npx expo start -c
```

---

## Testing

RetrieveID was tested across the major functional workflows of the application.

Testing covered:

- User registration
- Duplicate registration prevention
- Successful login
- Invalid login handling
- Authentication session restoration
- User profile updates
- Student ID image upload
- Found Student ID report submission
- Student ID confirmation validation
- Successful Student ID search
- No-report-found search
- Automatic Student ID matching
- In-app notification generation
- Email notification generation
- Notification read status
- Authorized Student ID image access
- Unauthorized image access prevention
- Collection confirmation
- Unauthorized collection prevention
- Multiple reports for the same Student ID
- Report status management
- Retrieval location selection
- Nearest retrieval location functionality
- Map directions
- Logout

A total of **25 functional tests were conducted and all passed successfully**.

The complete end-to-end recovery workflow was also tested from the initial reporting of a found Student ID through notification, retrieval, and collection confirmation.

---

## End-to-End Recovery Workflow

```text
Finder Reports Student ID
            ↓
Backend Processes Report
            ↓
Student ID Matching
            ↓
Owner Receives Notification
            ↓
Owner Views Report Details
            ↓
Owner Gets Directions
            ↓
Physical ID Collection
            ↓
Owner Confirms Collection
            ↓
Report Marked as Collected
```

---

## Current Limitations

The current version of RetrieveID has the following limitations:

- The application is not directly integrated with the University's official student database.
- Automatic owner notification depends on the owner having a registered RetrieveID account with the correct Student ID number linked.
- Physical submission of a Student ID to a retrieval point cannot be independently verified by the application.
- Physical collection of the Student ID cannot be independently verified without confirmation from the user.
- SMS notifications have not yet been fully implemented.
- The system currently focuses specifically on Student ID cards.
- The current version was developed primarily as an academic prototype.

---

## Future Improvements

Possible future improvements to RetrieveID include:

- Integration with official university student information systems.
- SMS notification support.
- Additional push-notification capabilities.
- Administrative management of retrieval locations.
- Wider usability testing involving more students.
- Production deployment for university-wide use.
- Improved verification of physical submission and collection.
- Support for other university identification documents.
- Expansion of the platform to other categories of lost-and-found items.

---

## Project Status

The core RetrieveID system has been successfully implemented and tested.

The current system supports:

- User registration and authentication
- Student ID linking
- Found Student ID reporting
- Student ID image upload
- Student ID search
- Exact Student ID matching
- Automatic owner notification
- In-app notifications
- Email notifications
- Secure Student ID image access
- Retrieval-location selection
- Nearest-location assistance
- Map directions
- Collection confirmation
- Profile management

---

## Author

**Gyamerah Sonny Antwi**  
**Student ID:** 11124499  
**Programme:** Computer Science  
**University:** University of Ghana

---

## Supervisor

**Dr. Matilda S. A. Wilson**

---

## Academic Project

This repository contains source code developed as part of a Final Year Project at the University of Ghana.

The project is intended primarily for academic and educational purposes.