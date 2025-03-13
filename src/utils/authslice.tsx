// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   isLoggedIn: false,
//   token: null,
//   batch_id: null,
//   Teacher_id: null,
//   selectBatch: null
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       state.isLoggedIn = true;
//       state.token = action.payload.token;
//       AsyncStorage.setItem("Token", action.payload.token)
//       state.Teacher_id = action.payload.Teacher_id
//       AsyncStorage.setItem("TeacherId", action.payload.Teacher_id)
//     },
//     logout: (state) => {
//       state.isLoggedIn = false;
//       state.token = null;
//     },
//     batch_id: (state, action) => {
//       state.batch_id = action.payload
//       AsyncStorage.setItem("batch_id", action.payload)
//     },
//     selectBatch: (state, action) => {
//       state.selectBatch = action.payload; // Store full batch object
//       AsyncStorage.setItem("selectedBatch", JSON.stringify(action.payload));
//     }
//   },
// });

// export const { login, logout, batch_id, selectBatch } = authSlice.actions;
// export default authSlice.reducer;




// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import { getapi } from '../utils/api'; // Ensure this import is correct

// // // Define fetch_batchs as an async thunk
// // export const fetch_batchs = createAsyncThunk('auth/fetch_batchs', async (_, { rejectWithValue }) => {
// //   console.log("entered batches fetching")
// //   try {
// //     const Token = await AsyncStorage.getItem('Token');
// //     const Teacher_id = await AsyncStorage.getItem('TeacherId');

// //     if (!Token || !Teacher_id) {
// //       console.error('Missing Token or Teacher ID');
// //       return rejectWithValue('No Token or Teacher ID found');
// //     }

// //     const url = `batches/teacher/${Teacher_id}`;
// //     const headers = {
// //       Accept: 'application/json',
// //       'Content-Type': 'application/json',
// //       Authorization: `Bearer ${Token}`,
// //     };

// //     return new Promise((resolve, reject) => {
// //       getapi(
// //         url,
// //         headers,
// //         async (res) => {
// //           console.log('Fetched batches:', res);
// //           resolve(res || []);
// //         },
// //         (error) => {
// //           console.error('Error fetching batches:', error);
// //           reject(error);
// //         }
// //       );
// //     });
// //   } catch (error) {
// //     console.error('Fetch Batch Error:', error);
// //     return rejectWithValue(error.message);
// //   }
// // });

// // const initialState = {
// //   isLoggedIn: false,
// //   token: null,
// //   batch_id: null,
// //   Teacher_id: null,
// //   selectBatch: null,
// //   batches: [], // Add batches array
// //   loading: false,
// //   error: null,
// // };

// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState,
// //   reducers: {
// //     login: (state, action) => {
// //       state.isLoggedIn = true;
// //       state.token = action.payload.token;
// //       AsyncStorage.setItem('Token', action.payload.token);
// //       state.Teacher_id = action.payload.Teacher_id;
// //       AsyncStorage.setItem('TeacherId', action.payload.Teacher_id);
// //     },
// //     logout: (state) => {
// //       state.isLoggedIn = false;
// //       state.token = null;
// //       state.batches = [];
// //     },
// //     batch_id: (state, action) => {
// //       state.batch_id = action.payload;
// //       AsyncStorage.setItem('batch_id', action.payload);
// //     },
// //     selectBatch: (state, action) => {
// //       state.selectBatch = action.payload || {}; // Prevent null errors
// //       AsyncStorage.setItem("selectedBatch", JSON.stringify(action.payload || {}));
// //     }
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetch_batchs.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetch_batchs.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.batches = action.payload || [];
// //       })
// //       .addCase(fetch_batchs.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //         state.batches = [];
// //       });
// //   },
// // });

// // export const { login, logout, batch_id, selectBatch } = authSlice.actions;
// // export default authSlice.reducer;





import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getapi } from '../utils/api'; // Ensure this import is correct

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

const initialState = {
  isLoggedIn: false,
  newBatchCreated: false,
  token: null,
  batch_id: null,
  Teacher_id: null,
  selectBatch: null,
  batches: [], // Add batches array
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
      AsyncStorage.setItem('Token', action.payload.token);
      state.Teacher_id = action.payload.Teacher_id;
      AsyncStorage.setItem('TeacherId', action.payload.Teacher_id);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.batches = [];
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
        state.error = action.payload;
        state.batches = [];
      });
  },
});

export const { login, logout, batch_id, selectBatch,setBatchCreated  } = authSlice.actions;
export default authSlice.reducer;



