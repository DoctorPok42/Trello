import { createSlice } from "@reduxjs/toolkit";

const trelloItemsSlice = createSlice({
  name: "trelloItems",
  initialState: {
    data: {
        boards: [],
        cards: [],
        lists: [],
        organizations: [],
    }
  },
  reducers: {
    setTrelloItems: (state, action) => {
        state.data.boards = action.payload.boards;
        state.data.cards = action.payload.cards;
        state.data.lists = action.payload.lists;
        state.data.organizations = action.payload.organizations;
    },
}});

  
export const { 
    setTrelloItems, 
} = trelloItemsSlice.actions;

export default trelloItemsSlice.reducer;