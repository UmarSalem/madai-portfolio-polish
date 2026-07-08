import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'SelectedStuffReducer',
    initialState: {
       
        selectedAdmin: null,

       
        selectedUserLogin: null,
       
        selectedUser: null,
     
    },

    reducers: {
        setSelectedUserLogin: (state, action) => {
            state.selectedUserLogin = action.payload;
        },
    
        setSelectedAdmin: (state, action) => {
            state.selectedAdmin = action.payload;
        },
      
    
      

        setSelectedUser: (state, action) => {
           
            state.selectedUser = action.payload;
        },
  
     
        resetSelectedStuffReducer: (state) => {
            state.selectedUserLogin = null;
          
            state.selectedAdmin= null;
         
           
            state.selectedUser = null;
  

        },
    },
});

export const {
    setSelectedUserLogin,
   
    setSelectedAdmin,


    setSelectedUser,

   

} = slice.actions;
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

export const selectedUserLoginSelector = (state) => state.SelectedStuffReducer.selectedUserLogin;
export const selectedAdminSelector = (state) => state.SelectedStuffReducer.selectedAdmin;

export const selectedUserSelector = (state) => state.SelectedStuffReducer.selectedUser;




export default slice.reducer;