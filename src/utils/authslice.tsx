import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  token: null,
  batch_id: null,
  Teacher_id: null,
  selectBatch: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      AsyncStorage.setItem("Token", action.payload.token)
      state.Teacher_id = action.payload.Teacher_id
      AsyncStorage.setItem("TeacherId", action.payload.Teacher_id)
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
    },
    batch_id: (state, action) => {
      state.batch_id = action.payload
      AsyncStorage.setItem("batch_id", action.payload)
    },
    selectBatch: (state, action) => {
      state.selectBatch = action.payload; // Store full batch object
      AsyncStorage.setItem("selectedBatch", JSON.stringify(action.payload));
    }
  },
});

export const { login, logout, batch_id, selectBatch } = authSlice.actions;
export default authSlice.reducer;
