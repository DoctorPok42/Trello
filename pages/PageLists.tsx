import { IonCreate } from "@/components/icons/IonCreate";
import { Header } from "@/components/trello/Header";
import store, { RootState } from "@/store";
import { setListId } from "@/store/slices/listSlice";
import { activeTrigger } from "@/store/slices/triggerSlice";
import { getCardsFromList, createCardInList } from "@/utils/trello/cards";
import { createListByBoardId, getListsByBoardId, renameList } from "@/utils/trello/lists";
import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, GestureResponderEvent } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import { ItemsList } from "./ItemsList";
import { Card } from "@/types/Card";

export const PageLists = () => {
  const dispatch = useDispatch();
  const [lists, setLists] = useState<any[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const boardId = store.getState().board.data.id;
  const listId = store.getState().list.data.id;
  const list = useSelector((state: RootState) => state.list.data);
  const trigger = useSelector((state: RootState) => state.activeTrigger);

  const fetchCards = async (id: string) => {
    const responseData = await getCardsFromList(id);
    if (responseData) setCards(responseData);
  };

  const fetchLists = async () => {
    const responseData = await getListsByBoardId(boardId);
    if (responseData) setLists(responseData);
  };

  const handleCreateCard = (event: GestureResponderEvent) => {
    event.stopPropagation();
    Alert.prompt("New Card", "Type card's name.", async (name) => {
      const response = await createCardInList(
        name,
        store.getState().list.data.id
      );
      if (response) {
        await fetchCards(listId);
        Toast.success("Card created.");
      } else Toast.error("Error during card creation.");
    });
  };

  const handleCreateList = async () => {
    Alert.prompt("New List", "Type the list's name.", async (name) => {
      const response = await createListByBoardId(name, boardId);
      if (response) {
        await fetchLists();
        Toast.success("List created.");
      } else Toast.error("Error during list creation.");
    });
  };

  const handleSelectList = async (listId: string) => {
    await fetchCards(listId);
    dispatch(setListId({ ...list, id: listId }));
  };

  const handleRenameList = async (listID: string) => {
    Alert.prompt("Rename board", "Type List's new name.", async (name) => {
      const response = await renameList(listID, name);
      if (response) {
        dispatch(activeTrigger(true));
        Toast.success("Organization renamed.");
      } else Toast.error("Error during List's rename.");
    });
  };

  const handleDeleteList = async (listID: string) => {
    const response = await renameList(listID);
    if (response) {
      dispatch(activeTrigger(true));
      Toast.success("List deleted.");
    } else Toast.error("Error during deleting List.");
  };

  useEffect(() => {
    fetchCards(listId);
  }, []);

  useEffect(() => {
    fetchLists();
    dispatch(activeTrigger(false));
  }, [trigger]);

  return (
    <View style={styles.container}>
      <Header title="My Lists" svg={<IonCreate />} action={handleCreateList} />
      <ItemsList
        renameAction={handleRenameList}
        deleteAction={handleDeleteList}
        redirectAction={handleSelectList}
        givenItem="Lists"
        data={lists}
        cards={cards}
        handleCreateCard={handleCreateCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  noList: {
    color: "gray",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
});
