import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
  name: "list",
  initialState: {
    data: {
      id: "",
      displayName: "",
    }
  },
  reducers: {
    setListData: (state, action) => {
      state.data.id = action.payload.id;
    },
}});

  
export const { 
setListData, 
} = listSlice.actions;

export default listSlice.reducer;