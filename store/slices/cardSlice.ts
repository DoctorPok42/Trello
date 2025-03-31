import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
  name: "card",
  initialState: {
    data: {
      id: "",
      displayName: "",
    }
  },
  reducers: {
    setCardData: (state, action) => {
      state.data.id = action.payload.id;
    },
}});

  
export const { 
  setCardData, 
} = cardSlice.actions;

export default cardSlice.reducer;