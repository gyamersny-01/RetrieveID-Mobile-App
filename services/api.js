export const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn(
    'EXPO_PUBLIC_API_URL is not configured.'
  );
}

export async function apiRequest(
  endpoint,
  options = {}
) {
  const isFormData =
    options.body instanceof FormData;

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        ...(isFormData
          ? {}
          : {
              'Content-Type':
                'application/json',
            }),

        ...options.headers,
      },
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(
      data.message ||
        'Something went wrong.'
    );

    error.status = response.status;

    throw error;
  }

  return data;
}