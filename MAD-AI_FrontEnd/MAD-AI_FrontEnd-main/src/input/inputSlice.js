import { createSlice } from "@reduxjs/toolkit";

const inputSlice = createSlice({
  name: "input",
  initialState: { 
    value: { 
      email: "hanzla7658@gmail.com", 
      password: "expert123" 
    }
  },
  reducers: {
    setEmail: (state, action) => {
      state.value.email = action.payload;
    },
    setPassword: (state, action) => {
      state.value.password = action.payload;
    },
  },
});

export const { setEmail, setPassword } = inputSlice.actions;
export const selectEmail = (state) => state.input.value.email;
export const selectPassword = (state) => state.input.value.password;
export default inputSlice.reducer;