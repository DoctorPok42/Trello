import { Cards } from "@/components/trello/card";
import store, { RootState } from "@/store";
import { setListData } from "@/store/slices/listSlice";
import { createListByBoardId, getListsByBoardId } from "@/utils/trello/lists";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

export const PageLists = () => {
  const [lists, setLists] = useState<any[]>();
  const list = useSelector((state: RootState) => state.board.data);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const boardId = store.getState().board.data.id;

  const fetchLists = async () => {
    const responseData = await getListsByBoardId(boardId);
    if (responseData) setLists(responseData);
  };

  const handleCreateList = () => {
    Alert.prompt("New List", "Type the list's name.", async (name) => {
      const response = await createListByBoardId(name, boardId);
      response ? Toast.success("List created.") : Toast.error("Error during list creation.");
      if (response) navigation.navigate("PageCards" as never);
    });
  };

  const handleSelectList = (listId: string) => {
    dispatch(setListData({ ...list, id: listId }));
    navigation.navigate("PageCards" as never);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Lists</Text>
      {lists?.map((list, index) => (
        <Cards title={list.name} key={index} onPress={() => handleSelectList(list.id)} />
      ))}
      <Cards title="Create a list" onPress={handleCreateList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
});