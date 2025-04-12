import { createSlice } from "@reduxjs/toolkit";

const triggerSlice = createSlice({
  name: "trigger",
  initialState: {
    activeTrigger: false,
  },
  reducers: {
    activeTrigger: (state, action) => {
      state.activeTrigger = action.payload;
    }
  },
});

export const {
  activeTrigger,
} = triggerSlice.actions;

export default triggerSlice.reducer;
