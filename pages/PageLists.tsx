import { IonCreate } from "@/components/icons/IonCreate";
import { Header } from "@/components/trello/Header";
import store, { RootState } from "@/store";
import { activeTrigger } from "@/store/slices/triggerSlice";
import { createListByBoardId, getListsByBoardId, renameList } from "@/utils/trello/lists";
import { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import { ManageLabels } from "./ManageLabels";

export const PageLists = () => {
  const dispatch = useDispatch();
  const [lists, setLists] = useState<any[]>([]);
  const boardId = store.getState().board.data.id;
  const trigger = useSelector((state: RootState) => state.activeTrigger);

  const fetchLists = async () => {
    const responseData = await getListsByBoardId(boardId);
    if (responseData) setLists(responseData);
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
    fetchLists();
    dispatch(activeTrigger(false));
  }, [trigger]);

  return (
    <View style={styles.container}>
      <Header title="My Lists" svg={<IonCreate />} action={handleCreateList} />
      <ManageLabels
        renameAction={handleRenameList}
        deleteAction={handleDeleteList}
        givenItem="Lists"
        data={lists}
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
