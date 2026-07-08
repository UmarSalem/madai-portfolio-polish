import { createSlice } from '@reduxjs/toolkit';
export const LANGUAGES={}
export const slice = createSlice({
  name: 'GlobalReducer',
  initialState: {
    selectedId:[],
  },
  reducers: {
    setselectedId : (state, action) => {
      //console.log("data", state, " ", action)
        state.selectedId.push(action.payload);
    },
    resetSettingsReducer : (state) => {
        state.selectedId=[];
    },
  },
});

export const {
    setselectedId,
    resetSettingsReducer,
 } = slice.actions;
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

export const selectedIdSelector = (state) => state.GlobalReducer.selectedId;

export default slice.reducer;