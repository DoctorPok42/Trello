import { configureStore } from "@reduxjs/toolkit";
import organizationSlice from "@/store/slices/organizationSlice";
import boardSlice from "@/store/slices/boardSlice";
import listSlice from "@/store/slices/listSlice";

const store = configureStore({
  reducer: {
    organization: organizationSlice,
    board: boardSlice,
    list: listSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;