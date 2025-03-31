import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",
  initialState: {
    data: {
      id: "",
      displayName: "",
    }
  },
  reducers: {
    setBoardData: (state, action) => {
      state.data.id = action.payload.id;
    },
}});

  
export const { 
setBoardData, 
} = boardSlice.actions;

export default boardSlice.reducer;