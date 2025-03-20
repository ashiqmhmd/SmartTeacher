


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
import { logout } from './authslice';
import { useNavigation } from '@react-navigation/native';

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


// export const handleLogout = async (navigation): Promise<void> => {

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
      await requestFunction(url, newHeaders, body, wrappedOnResponse, wrappedOnCatch);
    } else {
      // If refresh failed, force logout and ensure loading state is updated
      await AsyncStorage.multiRemove(['Token', 'RefreshToken', 'TeacherId']);
      // handleLogout(navigation)
      
      if (onCatch) {
        onCatch(new Error('Session expired. Please login again.'));
        // handleLogout(navigation)
      }
    }
  } catch (error) {
    console.error('Token refresh handling error:', error);
    await AsyncStorage.multiRemove(['Token', 'RefreshToken', 'TeacherId']);
    // handleLogout(navigation)
    if (onCatch) {
      onCatch(error);
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

    console.log('Request Body:', body);

    fetch(base_url + url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    })
      .then(async response => {
        // Handle token expiration (401 Unauthorized)
        if (response.status === 401) {
          // Don't parse the response, instead refresh token and retry
          await handleTokenRefresh(
            postApi,
            url,
            header,
            body,
            onResponse,
            onCatch,
          );
          return null;
        }

        const text = await response.text();
        console.log('Raw Response:', text);

        try {
          // Fix malformed JSON if necessary
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
    console.error('POST API Error:', error);
    onCatch && onCatch(error);
  }
};

// Enhanced GET API with token refresh
export const getapi = async (
  url: string = '',
  header: Record<string, string> = {},
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
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
      await handleTokenRefresh(getapi, url, header, null, onResponse, onCatch);
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
): Promise<any> => {
  const headers = {
    'Content-Type': 'application/json',
    ...header,
  };

  console.log('Request Body:', body);

  fetch(base_url + url, {
    method: 'PATCH',
    headers: headers,
    body: body ? JSON.stringify(body) : null, // Ensure empty body is handled
  })
    .then(async response => {
      const text = await response.text();
      console.log('Raw Response:', text);

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
      } catch (error) {
        console.error('JSON Parse Error:', error);
        throw new Error(`Invalid JSON response: ${text}`);
      }
    })
    .catch(e => {
      console.error('Fetch Error:', e);
      // Call the onCatch callback if provided
      onCatch && onCatch(e);
    });
  }

// Enhanced PUT API with token refresh
export const putapi = async (
  url: string = '',
  header: Record<string, string> = {},
  body: Record<string, any> = {},
  onResponse: Callback | null = null,
  onCatch: Callback | null = null,
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

    console.log('PUT Request Body:', body);

    fetch(base_url + url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body),
    })
      .then(async response => {
        // Handle token expiration (401 Unauthorized)
        if (response.status === 401) {
          await handleTokenRefresh(
            putapi,
            url,
            header,
            body,
            onResponse,
            onCatch,
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

