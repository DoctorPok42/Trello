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
    setListId: (state, action) => {
      state.data.id = action.payload.id;
    },
}});

  
export const { 
  setListId, 
} = listSlice.actions;

export default listSlice.reducer;