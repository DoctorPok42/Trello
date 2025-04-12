import { createSlice } from "@reduxjs/toolkit";

interface OrganisationState {
  id: string;
  name: string | null;
}

const initialState: OrganisationState = {
  id: "",
  name: null,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizationData: (state, action) => {
      state.id = action.payload.id;
    },
    setOrganizationName: (state, action) => {
      state.name = action.payload.name;
    },
  },
});

export const { setOrganizationData, setOrganizationName } =
  organizationSlice.actions;

export default organizationSlice.reducer;
