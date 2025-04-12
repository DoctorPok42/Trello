import { createSlice } from "@reduxjs/toolkit";

const triggerSlice = createSlice({
  name: "trigger",
  initialState: {
    updateCardTrigger: false,
    deleteCardTrigger: false,
  },
  reducers: {
    updateCardTrigger: (state, action) => {
      state.updateCardTrigger = action.payload;
    },
    deleteCardTrigger: (state, action) => {
      state.deleteCardTrigger = action.payload;
    },
  },
});

export const { deleteCardTrigger, updateCardTrigger } = triggerSlice.actions;

export default triggerSlice.reducer;
