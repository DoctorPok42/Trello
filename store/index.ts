import { configureStore } from "@reduxjs/toolkit";
import organizationSlice from "@/store/slices/organizationSlice";

const store = configureStore({
  reducer: {
    organization: organizationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;