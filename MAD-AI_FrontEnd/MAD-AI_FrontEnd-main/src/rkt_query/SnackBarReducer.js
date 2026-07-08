import { createSlice } from "@reduxjs/toolkit";
export const slice = createSlice({
  name: "SnackBarReducer",
  initialState: {
    message: null,
    status: null,
  },
  reducers: {
    setSnackBarMessage: (state, action) => {
      state.message = action.payload;
    },
    setSnackBarStatuses: (state, action) => {
      console.log(action.payload, "action.payload");
      state.status = action.payload;
    },
    hideSnackBarMessage: (state) => {
      state.message = null;
      state.status = null;
    },
  },
});
export const { setSnackBarMessage, setSnackBarStatuses, hideSnackBarMessage } =
  slice.actions;
export const snackBarMessageSelector = (state) => state.SnackBarReducer.message;
export const snackBarStatusSelector = (state) => state.SnackBarReducer.status;
export default slice.reducer;
