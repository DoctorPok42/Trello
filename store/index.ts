import { configureStore } from "@reduxjs/toolkit";
import organizationSlice from "@/store/slices/organizationSlice";
import boardSlice from "@/store/slices/boardSlice";
import listSlice from "@/store/slices/listSlice";
import cardSlice from "@/store/slices/cardSlice";
import trelloItemsSlice from "@/store/slices/trelloItemsSlice";
import triggerSlice from "@/store/slices/triggerSlice";

const store = configureStore({
  reducer: {
    organization: organizationSlice,
    board: boardSlice,
    list: listSlice,
    card: cardSlice,
    trelloItems: trelloItemsSlice,
    activeTrigger: triggerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;