import { createSlice } from "@reduxjs/toolkit";

const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    data: {
      id: "",
      displayName: "",
    }
  },
  reducers: {
    setOrganizationData: (state, action) => {
      state.data.id = action.payload.id;
    },
}});

  
export const { 
setOrganizationData, 
} = organizationSlice.actions;

export default organizationSlice.reducer;