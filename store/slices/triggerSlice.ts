import { createSlice } from "@reduxjs/toolkit";

const triggerSlice = createSlice({
  name: "trigger",
  initialState: {
    updateCardTrigger: false,
  },
  reducers: {
    updateCardTrigger: (state, action) => {
      state.updateCardTrigger = action.payload;
    },
  },
});

export const { updateCardTrigger } = triggerSlice.actions;

export default triggerSlice.reducer;
