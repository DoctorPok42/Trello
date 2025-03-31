import { configureStore } from "@reduxjs/toolkit";
import organizationSlice from "@/store/slices/organizationSlice";
import boardSlice from "@/store/slices/boardSlice";

const store = configureStore({
  reducer: {
    organization: organizationSlice,
    boardSlice: boardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;