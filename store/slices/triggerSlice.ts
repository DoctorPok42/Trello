import { createSlice } from "@reduxjs/toolkit";

const triggerSlice = createSlice({
  name: "trigger",
  initialState: {
    updateCardTrigger: false,
    deleteCardTrigger: false,
    updateOrganizationTrigger: false,

  },
  reducers: {
    updateCardTrigger: (state, action) => {
      state.updateCardTrigger = action.payload;
    },
    deleteCardTrigger: (state, action) => {
      state.deleteCardTrigger = action.payload;
    },
    updateOrganizationTrigger: (state, action) => {
      state.updateOrganizationTrigger = action.payload;
    }
  },
});

export const { deleteCardTrigger, updateCardTrigger, updateOrganizationTrigger } = triggerSlice.actions;

export default triggerSlice.reducer;
