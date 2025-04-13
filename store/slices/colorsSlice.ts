import { createSlice } from "@reduxjs/toolkit";

const colorSlice = createSlice({
  name: "color",
  initialState: {
    activeColor: '#000',
  },
  reducers: {
    setBottomBarColor: (state, action) => {
      state.activeColor = action.payload;
    }
  },
});

export const {
    setBottomBarColor,
} = colorSlice.actions;

export default colorSlice.reducer;
