import { IonCreate } from "@/components/icons/IonCreate";
import { MaterialSymbolsArrowDropDownCircleOutline } from "@/components/icons/MaterialSymbolsArrowDropDownCircleOutline";
import { Header } from "@/components/trello/Header";
import { ListCard } from "@/components/trello/ListCard";
import store, { RootState } from "@/store";
import { setListId } from "@/store/slices/listSlice";
import { updateCardTrigger } from "@/store/slices/triggerSlice";
import { getCardsFromList, createCardInList } from "@/utils/trello/cards";
import { createListByBoardId, getListsByBoardId } from "@/utils/trello/lists";
import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, FlatList, GestureResponderEvent } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

export const PageLists = () => {
  const dispatch = useDispatch();
  const [lists, setLists] = useState<any[]>();
  const [cards, setCards] = useState<any[]>();
  const boardId = store.getState().board.data.id;
  const listId = store.getState().list.data.id;
  const list = useSelector((state: RootState) => state.list.data);
  const trigger = useSelector((state: RootState) => state.activeTrigger);

  useEffect(() => {
    fetchCards(listId)
    dispatch(updateCardTrigger(false));
  }, [trigger])

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

  useEffect(() => {
    fetchCards(listId);
  }, []);

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="My Lists" svg={<IonCreate />} action={handleCreateList} />
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListCard
            svg={<MaterialSymbolsArrowDropDownCircleOutline />}
            title={item.name}
            onPress={() => handleSelectList(item.id)}
            hasData={list.id === item.id ? true : false}
            data={list.id === item.id ? cards : []}
            noRoundBorder={true}
            handleCreateCard={handleCreateCard}
          />
        )}
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
