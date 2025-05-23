// import AsyncStorage from '@react-native-async-storage/async-storage';
// import store from './store';
// import { logout } from './authslice';

// type Callback<T = any> = (data: T) => void;

// interface FileData {
//   uri: string;
//   name: string;
//   type: string;
// }

// interface RefreshTokenResponse {
//   token: string;
//   refreshToken?: string;
// }

// const BASE_URL = 'https://zkbsgdbbhc.execute-api.us-east-1.amazonaws.com/Dev/';

// export const handleLogout = async (navigation: any): Promise<void> => {
//   try {
//     // First, clear AsyncStorage items
//     await AsyncStorage.multiRemove([
//       'Token',
//       'RefreshToken',
//       'TeacherId',
//       'batch_id',
//       'selectedBatch'
//     ]);

//     // Then dispatch the logout action to Redux
//     store.dispatch(logout());

//     console.log('User logged out due to expired refresh token');

//     // Navigate to login screen using the passed navigation object
//     if (navigation) {
//       // Reset navigation stack and go to Login
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Login' }],
//       });
//     }
//   } catch (error) {
//     console.error('Error during logout process:', error);
//   }
// };

// // Function to refresh the token
// export const refreshToken = async (): Promise<RefreshTokenResponse | null> => {
//   console.log('Entered the refreshToken function');
//   try {
//     const refreshToken = await AsyncStorage.getItem('RefreshToken');

//     if (!refreshToken) {
//       console.error('No refresh token found');
//       return null;
//     }

//     const url = 'login/refresh'; // Adjust this to your actual refresh endpoint
//     const headers = {
//       'Content-Type': 'application/json',
//       'refresh-token': refreshToken,
//     };

//     const response = await fetch(BASE_URL + url, {
//       method: 'GET',
//       headers: headers,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }

//     const text = await response.text();

//     try {
//       // Fix malformed JSON if necessary
//       const fixedText = text.replace(
//         /"token":\s*([^"{\[][^,}\]]*)/g,
//         '"token": "$1"',
//       );

//       const responseJson = JSON.parse(fixedText);

//       if (responseJson.token) {
//         // Store the new authorization token
//         await AsyncStorage.setItem('Token', responseJson.token);
//         console.log('Token stored successfully');

//         // If a new refresh token is provided, store it as well
//         if (responseJson.refreshToken) {
//           await AsyncStorage.setItem('RefreshToken', responseJson.refreshToken);
//         }

//         return {
//           token: responseJson.token,
//           refreshToken: responseJson.refreshToken || refreshToken,
//         };
//       } else {
//         throw new Error('Invalid response from refresh token endpoint');
//       }
//     } catch (error) {
//       console.error('JSON Parse Error:', error);
//       throw new Error(`Invalid JSON response: ${text}`);
//     }
//   } catch (error) {
//     console.error('Token Refresh Error:', error);
//     return null;
//   }
// };

// // Handle token refresh and retry the original request
// export const handleTokenRefresh = async (
//   requestFunction: Function,
//   url: string,
//   header: Record<string, string>,
//   body: Record<string, any> | null,
//   onResponse: Callback | null,
//   onCatch: Callback | null,
//   navigation: any,
// ): Promise<void> => {
//   try {
//     const refreshResult = await refreshToken();

//     if (refreshResult && refreshResult.token) {
//       // Update the Authorization header with the new token
//       const newHeaders = {
//         ...header,
//         Authorization: `Bearer ${refreshResult.token}`,
//       };

//       // Retry the original request
//       await requestFunction(url, newHeaders, body, onResponse, onCatch);
//     } else {
//       // If refresh failed, force logout
//       await AsyncStorage.multiRemove(['Token', 'RefreshToken', 'TeacherId']);
//       await handleLogout(navigation);

//       if (onCatch) {
//         onCatch(new Error('Session expired. Please login again.'));
//       }
//     }
//   } catch (error) {
//     console.error('Token refresh handling error:', error);
//     await AsyncStorage.multiRemove(['Token', 'RefreshToken', 'TeacherId']);
//     await handleLogout(navigation);

//     if (onCatch) {
//       onCatch(error);
//     }
//   }
// };

// // Enhanced POST API with token refresh
// export const postApi = async (
//   url: string = '',
//   header: Record<string, string> = {},
//   body: Record<string, any> = {},
//   onResponse: Callback | null = null,
//   onCatch: Callback | null = null,
//   navigation: any = null,
// ): Promise<any> => {
//   try {
//     // Add authorization token if available
//     const token = await AsyncStorage.getItem('Token');
//     const headers = {
//       'Content-Type': 'application/json',
//       ...header,
//     };

//     if (token && !headers.Authorization) {
//       headers.Authorization = `Bearer ${token}`;
//     }

//     console.log('Request Body:', body);

//     const response = await fetch(BASE_URL + url, {
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify(body),
//     });

//     // Handle token expiration (401 Unauthorized)
//     if (response.status === 401) {
//       await handleTokenRefresh(
//         postApi,
//         url,
//         header,
//         body,
//         onResponse,
//         onCatch,
//         navigation,
//       );
//       return null;
//     }

//     const text = await response.text();
//     console.log('Raw Response:', text);

//     try {
//       // Fix malformed JSON if necessary
//       const fixedText = text.replace(
//         /"token":\s*([^"{\[][^,}\]]*)/g,
//         '"token": "$1"',
//       );

//       const responseJson = JSON.parse(fixedText);
//       console.log('Parsed JSON:', responseJson);

//       if (onResponse) {
//         onResponse(responseJson);
//       }

//       return responseJson;
//     } catch (error) {
//       console.error('JSON Parse Error:', error);
//       throw new Error(`Invalid JSON response: ${text}`);
//     }
//   } catch (error) {
//     console.error('POST API Error:', error);
//     if (onCatch) {
//       onCatch(error);
//     }
//     return null;
//   }
// };

// // Enhanced GET API with token refresh
// export const getapi = async (
//   url: string = '',
//   header: Record<string, string> = {},
//   onResponse: Callback | null = null,
//   onCatch: Callback | null = null,
//   navigation: any = null,
// ): Promise<any> => {
//   try {
//     // Add authorization token if available
//     const token = await AsyncStorage.getItem('Token');
//     const headers = {
//       'Content-Type': 'application/json',
//       ...header,
//     };

//     if (token && !headers.Authorization) {
//       headers.Authorization = `Bearer ${token}`;
//     }

//     console.log('Headers:', headers);

//     const response = await fetch(BASE_URL + url, {
//       method: 'GET',
//       headers: headers,
//     });

//     // Handle token expiration (401 Unauthorized)
//     if (response.status === 401) {
//       await handleTokenRefresh(
//         getapi,
//         url,
//         header,
//         null,
//         onResponse,
//         onCatch,
//         navigation
//       );
//       return null;
//     }

//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }

//     const text = await response.text();

//     try {
//       // Fix malformed JSON if necessary
//       const fixedText = text.replace(
//         /"token":\s*([^"{\[][^,}\]]*)/g,
//         '"token": "$1"',
//       );

//       const responseJson = JSON.parse(fixedText);
//       console.log('Response:', responseJson);

//       if (onResponse) {
//         onResponse(responseJson);
//       }

//       return responseJson;
//     } catch (error) {
//       console.error('JSON Parse Error:', error);
//       throw new Error(`Invalid JSON response: ${text}`);
//     }
//   } catch (error) {
//     console.error('API Fetch Error:', error);

//     if (onCatch) {
//       onCatch(error);
//     }

//     return null;
//   }
// };

// export const patchApi = async (
//   url: string = '',
//   header: Record<string, string> = {},
//   body: Record<string, any> | null = null,
//   onResponse: Callback | null = null,
//   onCatch: Callback | null = null,
//   navigation: any = null,
// ): Promise<any> => {
//   try {
//     // Add authorization token if available
//     const token = await AsyncStorage.getItem('Token');
//     const headers = {
//       'Content-Type': 'application/json',
//       ...header,
//     };

//     if (token && !headers.Authorization) {
//       headers.Authorization = `Bearer ${token}`;
//     }

//     console.log('PATCH Request Body:', body);

//     const response = await fetch(BASE_URL + url, {
//       method: 'PATCH',
//       headers: headers,
//       body: body ? JSON.stringify(body) : null,
//     });

//     // Handle token expiration (401 Unauthorized)
//     if (response.status === 401) {
//       await handleTokenRefresh(
//         patchApi,
//         url,
//         header,
//         body,
//         onResponse,
//         onCatch,
//         navigation,
//       );
//       return null;
//     }

//     const text = await response.text();
//     console.log('Raw Response:', text);

//     try {
//       // Fix malformed JSON if necessary
//       const fixedText = text.replace(
//         /"token":\s*([^"{\[][^,}\]]*)/g,
//         '"token": "$1"',
//       );

//       const responseJson = JSON.parse(fixedText);
//       console.log('Parsed JSON:', responseJson);

//       if (onResponse) {
//         onResponse(responseJson);
//       }

//       return responseJson;
//     } catch (error) {
//       console.error('JSON Parse Error:', error);
//       throw new Error(`Invalid JSON response: ${text}`);
//     }
//   } catch (error) {
//     console.error('PATCH API Error:', error);
//     if (onCatch) {
//       onCatch(error);
//     }
//     return null;
//   }
// };

// // Enhanced PUT API with token refresh
// export const putapi = async (
//   url: string = '',
//   header: Record<string, string> = {},
//   body: Record<string, any> = {},
//   onResponse: Callback | null = null,
//   onCatch: Callback | null = null,
//   navigation: any = null,
// ): Promise<any> => {
//   try {
//     // Add authorization token if available
//     const token = await AsyncStorage.getItem('Token');
//     const headers = {
//       'Content-Type': 'application/json',
//       ...header,
//     };

//     if (token && !headers.Authorization) {
//       headers.Authorization = `Bearer ${token}`;
//     }

//     console.log('PUT Request Body:', body);

//     const response = await fetch(BASE_URL + url, {
//       method: 'PUT',
//       headers: headers,
//       body: JSON.stringify(body),
//     });

//     // Handle token expiration (401 Unauthorized)
//     if (response.status === 401) {
//       await handleTokenRefresh(
//         putapi,
//         url,
//         header,
//         body,
//         onResponse,
//         onCatch,
//         navigation,
//       );
//       return null;
//     }

//     const text = await response.text();
//     console.log('Raw Response:', text);

//     try {
//       const fixedText = text.replace(
//         /"token":\s*([^"{\[][^,}\]]*)/g,
//         '"token": "$1"',
//       );

//       const responseJson = JSON.parse(fixedText);
//       console.log('Parsed JSON:', responseJson);

//       if (onResponse) {
//         onResponse(responseJson);
//       }

//       return responseJson;
//     } catch (error) {
//       console.error('JSON Parse Error:', error);
//       throw new Error(`Invalid JSON response: ${text}`);
//     }
//   } catch (error) {
//     console.error('PUT API Error:', error);
//     if (onCatch) {
//       onCatch(error);
//     }
//     return null;
//   }
// };

// // Helper function to check if token is present and valid
// export const isAuthenticated = async (): Promise<boolean> => {
//   const token = await AsyncStorage.getItem('Token');
//   return !!token;
// };

// // Helper function to clear auth data on logout
// export const clearAuthData = async (): Promise<void> => {
//   await AsyncStorage.multiRemove([
//     'Token',
//     'RefreshToken',
//     'TeacherId',
//     'batch_id',
//     'selectedBatch',
//   ]);
// };

import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './store';
import {logout} from './authslice';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';

type Callback<T = any> = (data: T) => void;

interface FileData {
  uri: string;
  name: string;
  type: string;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

let base_url = 'https://zkbsgdbbhc.execute-api.us-east-1.amazonaws.com/Dev/';

export const handleLogout = async (navigation: any): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      'Token',
      'RefreshToken',
      'TeacherId',
      'batch_id',
      'selectedBatch',
    ]);

    store.dispatch(logout());

    console.log('User logged out due to expired refresh token');

    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  } catch (error) {
    console.error('Error during logout process:', error);
  }
};

// Function to refresh the token
export const refreshToken = async (): Promise<RefreshTokenResponse | null> => {
  console.log('entered the refreshtoken function');
  try {
    const refreshToken = await AsyncStorage.getItem('RefreshToken');

    if (!refreshToken) {
      console.error('No refresh token found');
      return null;
    }

    const url = 'login/refresh'; // Adjust this to your actual refresh endpoint
    const headers = {
      'Content-Type': 'application/json',
      'refresh-token': refreshToken,
    };

    const response = await fetch(base_url + url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const text = await response.text();

    try {
      // Fix malformed JSON if necessary (based on your existing code)
      const fixedText = text.replace(
        /"token":\s*([^"{\[][^,}\]]*)/g,
        '"token": "$1"',
      );

      const responseJson = JSON.parse(fixedText);

      if (responseJson.token) {
        // Store the new authorization token
        await AsyncStorage.setItem('Token', responseJson.token);
        console.log('token setted');
        // If a new refresh token is provided, store it as well
        if (responseJson.refreshToken) {
          await AsyncStorage.setItem('RefreshToken', responseJson.refreshToken);
        }

        return {
          token: responseJson.token,
          refreshToken: responseJson.refreshToken || refreshToken,
        };
      } else {
        throw new Error('Invalid response from refresh token endpoint');
      }
    } catch (error) {
      console.error('JSON Parse Error:', error);
      throw new Error(`Invalid JSON response: ${text}`);
    }
  } catch (error) {
    console.error('Token Refresh Error:', error);
    return null;
  }
};

// Handle token refresh and retry the original request

const handleTokenRefresh = async (
  requestFunction: Function,
  url: string,
  header: Record<string, string>,
  body: Record<string, any> | null,
  onResponse: Callback | null,
  onCatch: Callback | null,
  navigation?: any,
): Promise<void> => {
  try {
    const refreshResult = await refreshToken();

    if (refreshResult && refreshResult.token) {
      // Update the Authorization header with the new token
      const newHeaders = {
        ...header,
        Authorization: `Bearer ${refreshResult.token}`,
      };

      // Create wrapper callbacks to ensure loading state is updated
      const wrappedOnResponse = (data: any) => {
        onResponse && onResponse(data);
      };

      const wrappedOnCatch = (error: any) => {
        onCatch && onCatch(error);
      };

      // Retry the original request with wrapped callbacks
      await requestFunction(
        url,
        newHeaders,
        body,
        wrappedOnResponse,
        wrappedOnCatch,
      );
    } else {
      // If refresh failed, force logout and ensure loading state is updated
      await AsyncStorage.multiRemove(['Token', 'RefreshToken', 'TeacherId']);
      // handleLogout(navigation)

      if (onCatch) {
        onCatch(new Error('Session expired. Please login again.'));
        // handleLogout(navigation)
      }
      if (navigation) {
        Alert.alert(
          'Session Expired', // Title
          'Your session has expired. Please login again.', // Message
          [
            {
              text: 'OK',
              onPress: async () => {
                await handleLogout(navigation);
              }, // Action on OK
            },
          ],
          {cancelable: false}, // Prevent closing alert by tapping outside
        );
      }
    }
  } catch (error) {
    console.error('Token refresh handling error:', error);
    await AsyncStorage.multiRemove(['Token', 'RefreshToken', 'TeacherId']);
    // handleLogout(navigation)
    if (onCatch) {
      onCatch(error);
    }
    if (navigation) {
      Alert.alert(
        'Session Expired', // Title
        'Your session has expired. Please login again.', // Message
        [
          {
            text: 'OK',
            onPress: async () => {
              await handleLogout(navigation);
            }, // Action on OK
          },
        ],
        {cancelable: false}, // Prevent closing alert by tapping outside
      );
    }
  }
};

// Enhanced POST API with token refresh
export const postApi = async (
  url: string = '',
  header: Record<string, string> = {},
  body: Record<string, any> = {},
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
  navigation?: any,
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('Token');

    const headers = {
      'Content-Type': 'application/json',
      ...header,
    };

    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log('POST Request Body:', body);

    const response = await fetch(base_url + url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      await handleTokenRefresh(
        postApi,
        url,
        header,
        body,
        onResponse,
        onCatch,
        navigation,
      );
      return null;
    }

    const text = await response.text();
    console.log('Raw Response:', text);

    let responseJson: any;
    try {
      const fixedText = text.replace(
        /"token":\s*([^"{\[][^,}\]]*)/g,
        '"token": "$1"',
      );
      responseJson = JSON.parse(fixedText);
    } catch (err) {
      console.error('JSON Parse Error:', err);
      // Attempt to extract a cleaner error message from raw text
      let errorText = 'Something went wrong';
      try {
        const parsed = JSON.parse(text);
        errorText = parsed?.error || text;
      } catch {
        errorText = text;
      }
      throw new Error(errorText);
    }

    if (!response.ok) {
      const errorMessage = responseJson?.error || 'An error occurred';
      throw new Error(errorMessage);
    }

    onResponse && onResponse(responseJson);
  } catch (error: any) {
    const errorMessage =
      typeof error === 'string'
        ? error
        : error?.message || 'Something went wrong';

    console.error('POST API Error:', errorMessage);
    onCatch && onCatch({error: errorMessage});
  }
};

// Enhanced GET API with token refresh
export const getapi = async (
  url: string = '',
  header: Record<string, string> = {},
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
  navigation?: any,
): Promise<any> => {
  try {
    // Add authorization token if available
    const token = await AsyncStorage.getItem('Token');
    const headers = {
      'Content-Type': 'application/json',
      ...header,
    };

    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log('Headers:', headers);

    const response = await fetch(base_url + url, {
      method: 'GET',
      headers: headers,
    });

    // Handle token expiration (401 Unauthorized)
    if (response.status === 401) {
      await handleTokenRefresh(
        getapi,
        url,
        header,
        null,
        onResponse,
        onCatch,
        navigation,
      );
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const responseJson = await response.json();
    console.log('Response:', responseJson);

    if (onResponse) {
      onResponse(responseJson);
    }

    return responseJson;
  } catch (error) {
    console.error('API Fetch Error:', error);

    if (onCatch) {
      onCatch(error);
    }

    return null;
  }
};

export const patchApi = async (
  url: string = '',
  header: Record<string, string> = {},
  body: Record<string, any> | null = null,
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
  navigation?: any,
): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json',
    ...header,
  };

  console.log('Request Body:', body);

  try {
    const response = await fetch(base_url + url, {
      method: 'PATCH',
      headers: headers,
      body: body ? JSON.stringify(body) : null, // Ensure empty body is handled
    });

    const text = await response.text();
    console.log('Raw Response:', text);

    // Handle token expiration (401 Unauthorized)
    if (response.status === 401) {
      await handleTokenRefresh(
        getapi,
        url,
        header,
        null,
        onResponse,
        onCatch,
        navigation,
      );
      return null;
    }

    // Check for HTTP error status codes
    if (!response.ok) {
      const errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
      console.error(errorMessage, text);

      // Create error object with status and response text
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).responseText = text;

      // Call the onCatch callback if provided
      onCatch && onCatch(error);
      return Promise.reject(error);
    }

    try {
      // Fix malformed JSON if necessary
      const fixedText = text.replace(
        /"token":\s*([^"{\[][^,}\]]*)/g,
        '"token": "$1"',
      );

      const responseJson = JSON.parse(fixedText);
      console.log('Parsed JSON:', responseJson);

      // Call the onResponse callback if provided
      onResponse && onResponse(responseJson);
      return responseJson;
    } catch (error) {
      console.error('JSON Parse Error:', error);
      const parseError = new Error(`Invalid JSON response: ${text}`);

      // Call the onCatch callback if provided
      onCatch && onCatch(parseError);
      return Promise.reject(parseError);
    }
  } catch (e) {
    console.error('Fetch Error:', e);

    // Call the onCatch callback if provided
    onCatch && onCatch(e);
    return Promise.reject(e);
  }
};

// Enhanced PUT API with token refresh
export const putapi = async (
  url: string = '',
  header: Record<string, string> = {},
  body: Record<string, any> = {},
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
  navigation?: any,
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('Token');
    const headers = {
      'Content-Type': 'application/json',
      ...header,
    };

    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log('PUT Request Body:', body);

    const response = await fetch(base_url + url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      await handleTokenRefresh(
        putapi,
        url,
        header,
        body,
        onResponse,
        onCatch,
        navigation,
      );
      return null;
    }

    const text = await response.text();
    console.log('Raw Response:', text);

    let responseJson: any;

    try {
      const fixedText = text.replace(
        /"token":\s*([^"{\[][^,}\]]*)/g,
        '"token": "$1"',
      );
      responseJson = JSON.parse(fixedText);
    } catch (err) {
      console.error('JSON Parse Error:', err);
      throw new Error(`Invalid JSON response: ${text}`);
    }

    if (!response.ok) {
      // Handle validation or server error from API
      const errorMessage = responseJson?.error || 'An error occurred';
      throw new Error(errorMessage);
    }

    onResponse && onResponse(responseJson);
  } catch (error: any) {
    console.error('PUT API Error:', error);

    // Extract message safely
    const errorMessage =
      typeof error === 'string'
        ? error
        : error?.message || 'Something went wrong';
    console.log('error', error.message);
    onCatch && onCatch({error: errorMessage});
  }
};

export const deleteapi = async (
  url: string = '',
  header: Record<string, string> = {},
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
  navigation?: any,
): Promise<any> => {
  try {
    // Add authorization token if available
    const token = await AsyncStorage.getItem('Token');
    const headers = {
      'Content-Type': 'application/json',
      ...header,
    };

    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(base_url + url, {
      method: 'DELETE',
      headers: headers,
    })
      .then(async response => {
        // Handle token expiration (401 Unauthorized)
        if (response.status === 401) {
          await handleTokenRefresh(
            deleteapi,
            url,
            header,
            null,
            onResponse,
            onCatch,
            navigation,
          );
          return null;
        }

        const text = await response.text();
        console.log('Raw Response:', text);

        try {
          const fixedText = text.replace(
            /"token":\s*([^"{\[][^,}\]]*)/g,
            '"token": "$1"',
          );

          return JSON.parse(fixedText);
        } catch (error) {
          console.error('JSON Parse Error:', error);
          throw new Error(`Invalid JSON response: ${text}`);
        }
      })
      .then(responseJson => {
        if (responseJson) {
          console.log('Parsed JSON:', responseJson);
          onResponse && onResponse(responseJson);
        }
      })
      .catch(e => {
        console.error('Fetch Error:', e);
        onCatch && onCatch(e);
      });
  } catch (error) {
    console.error('PUT API Error:', error);
    onCatch && onCatch(error);
  }
};

// Helper function to check if token is present and valid
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('Token');
  return !!token;
};

// Helper function to clear auth data on logout
export const clearAuthData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    'Token',
    'RefreshToken',
    'TeacherId',
    'batch_id',
    'selectedBatch',
  ]);
};
