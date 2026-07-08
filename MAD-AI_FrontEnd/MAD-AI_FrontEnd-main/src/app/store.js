import { configureStore } from '@reduxjs/toolkit'; 
import inputSlice from '../input/inputSlice';

const store = configureStore({
  reducer: {
    input: inputSlice,
  },
});

export default store;