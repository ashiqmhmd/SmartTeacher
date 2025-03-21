

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getapi } from '../utils/api'; // Ensure this import is correct

// // Define fetch_batchs as an async thunk
// export const fetch_batchs = createAsyncThunk('auth/fetch_batchs', async (_, { rejectWithValue }) => {
//   try {
//     const Token = await AsyncStorage.getItem('Token');
//     const Teacher_id = await AsyncStorage.getItem('TeacherId');

//     if (!Token || !Teacher_id) {
//       console.error('Missing Token or Teacher ID');
//       return rejectWithValue('No Token or Teacher ID found');
//     }

//     const url = `batches/teacher/${Teacher_id}`;
//     const headers = {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${Token}`,
//     };

//     return new Promise((resolve, reject) => {
//       getapi(
//         url,
//         headers,
//         async (res) => {
//           console.log('Fetched batches:', res);
//           resolve(res || []);
//         },
//         (error) => {
//           console.error('Error fetching batches:', error);
//           reject(error);
//         }
//       );
//     });
//   } catch (error) {
//     console.error('Fetch Batch Error:', error);
//     return rejectWithValue(error.message);
//   }
// });

// const initialState = {
//   isLoggedIn: false,
//   newBatchCreated: false,
//   token: null,
//   batch_id: null,
//   Teacher_id: null,
//   selectBatch: null,
//   batches: [], // Add batches array
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       state.isLoggedIn = true;
//       state.token = action.payload.token;
//       AsyncStorage.setItem('Token', action.payload.token);
//       state.Teacher_id = action.payload.Teacher_id;
//       AsyncStorage.setItem('TeacherId', action.payload.Teacher_id);
//     },
//     logout: (state) => {
//       state.isLoggedIn = false;
//       state.token = null;
//       state.batches = [];
//     },
//     batch_id: (state, action) => {
//       state.batch_id = action.payload;
//       AsyncStorage.setItem('batch_id', action.payload);
//     },
//     selectBatch: (state, action) => {
//       state.selectBatch = action.payload || {}; // Prevent null errors
//       AsyncStorage.setItem("selectedBatch", JSON.stringify(action.payload || {}));
//     },
//     setBatchCreated: (state, action) => {
//       state.newBatchCreated = action.payload;
//     }

//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetch_batchs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetch_batchs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.batches = action.payload || [];
//       })
//       .addCase(fetch_batchs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.batches = [];
//       });
//   },
// });

// export const { login, logout, batch_id, selectBatch,setBatchCreated  } = authSlice.actions;
// export default authSlice.reducer;





import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getapi } from '../utils/api'; // Ensure this import is correct

// Define initial state with refresh token
interface AuthState {
  isLoggedIn: boolean;
  newBatchCreated: boolean;
  token: string | null;
  refreshToken: string | null; // Added refresh token
  batch_id: string | null;
  Teacher_id: string | null;
  Teacher_name:string | null;
  selectBatch: any | null;
  batches: any[];
  loading: boolean;
  error: string | null;
}

// Define fetch_batchs as an async thunk
export const fetch_batchs = createAsyncThunk('auth/fetch_batchs', async (_, { rejectWithValue }) => {
  try {
    const Token = await AsyncStorage.getItem('Token');
    const Teacher_id = await AsyncStorage.getItem('TeacherId');

    if (!Token || !Teacher_id) {
      console.error('Missing Token or Teacher ID');
      return rejectWithValue('No Token or Teacher ID found');
    }

    const url = `batches/teacher/${Teacher_id}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Token}`,
    };

    return new Promise((resolve, reject) => {
      getapi(
        url,
        headers,
        async (res) => {
          console.log('Fetched batches:', res);
          resolve(res || []);
        },
        (error) => {
          console.error('Error fetching batches:', error);
          reject(error);
        }
      );
    });
  } catch (error) {
    console.error('Fetch Batch Error:', error);
    return rejectWithValue(error.message);
  }
});

const initialState: AuthState = {
  isLoggedIn: false,
  newBatchCreated: false,
  token: null,
  refreshToken: null, // Added refresh token
  batch_id: null,
  Teacher_id: null,
  Teacher_name:null,
  selectBatch: null,
  batches: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null; // Handle refresh token
      state.Teacher_id = action.payload.Teacher_id;
      state.Teacher_name = action.payload.Teacher_name;
      
      // Store tokens in AsyncStorage
      AsyncStorage.setItem('Token', action.payload.token);
      if (action.payload.refreshToken) {
        AsyncStorage.setItem('RefreshToken', action.payload.refreshToken);
      }
      AsyncStorage.setItem('TeacherId', action.payload.Teacher_id);
      AsyncStorage.setItem('TeacherName', action.payload.Teacher_name);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.refreshToken = null; // Clear refresh token
      state.batches = [];
      state.batch_id = null;
      state.selectBatch = null;
      
      // Clear AsyncStorage
      AsyncStorage.removeItem('Token');
      AsyncStorage.removeItem('RefreshToken');
      AsyncStorage.removeItem('TeacherId');
      AsyncStorage.removeItem('batch_id');
      AsyncStorage.removeItem('selectedBatch');
    },
    batch_id: (state, action) => {
      state.batch_id = action.payload;
      AsyncStorage.setItem('batch_id', action.payload);
    },
    selectBatch: (state, action) => {
      state.selectBatch = action.payload || {}; // Prevent null errors
      AsyncStorage.setItem("selectedBatch", JSON.stringify(action.payload || {}));
    },
    setBatchCreated: (state, action) => {
      state.newBatchCreated = action.payload;
    },
    // Add reducer to update tokens
    updateTokens: (state, action) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        AsyncStorage.setItem('RefreshToken', action.payload.refreshToken);
      }
      AsyncStorage.setItem('Token', action.payload.token);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch_batchs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch_batchs.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload || [];
      })
      .addCase(fetch_batchs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.batches = [];
      });
  },
});

export const { login, logout, batch_id, selectBatch, setBatchCreated, updateTokens } = authSlice.actions;
export default authSlice.reducer;