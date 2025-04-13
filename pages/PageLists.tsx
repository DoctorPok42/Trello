import { IonCreate } from "@/components/icons/IonCreate";
import { Header } from "@/components/trello/Header";
import store, { RootState } from "@/store";
import { activeTrigger } from "@/store/slices/triggerSlice";
import { createListByBoardId, getLists, getListsByBoardId, renameList } from "@/utils/trello/lists";
import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import { ManageLabels } from "./ManageLabels";
import { getBoards } from "@/utils/trello/boards";

interface PageListsProps {
  displayAllLists?: boolean;
}

export const PageLists: React.FC<PageListsProps> = ({
  displayAllLists,
}) => {
  const dispatch = useDispatch();
  const [lists, setLists] = useState<any[]>([]);
  const boardId = store.getState().board.data.id;
  const trigger = useSelector((state: RootState) => state.activeTrigger);

  const fetchLists = async () => {
    if (!displayAllLists) {
      const responseData = await getListsByBoardId(boardId);
      if (responseData) setLists(responseData);
      return;
    } else {
      const boardsLists = await getBoards();
      const allLists = await getLists(boardsLists);
      if (allLists) setLists(allLists);
    }
  };

  const handleCreateList = async () => {
    Alert.prompt("New List", "Type the list's name.", async (name) => {
      const response = await createListByBoardId(name, boardId);
      if (response) {
        await fetchLists();
      } else Toast.error("Error during list creation.");
    });
  };

  const handleRenameList = async (listID: string) => {
    Alert.prompt("Rename board", "Type List's new name.", async (name) => {
      const response = await renameList(listID, name);
      if (response) {
        dispatch(activeTrigger(true));
      } else Toast.error("Error during List's rename.");
    });
  };

  const handleDeleteList = async (listID: string) => {
    const response = await renameList(listID);
    if (response) {
      dispatch(activeTrigger(true));
    } else Toast.error("Error during deleting List.");
  };

  useEffect(() => {
    fetchLists();
    dispatch(activeTrigger(false));
  }, [trigger]);

  return (
    <ImageBackground source={require("@/assets/images/background.jpg")} style={{ flex: 1 }}>
    <View style={styles.container}>
      {!displayAllLists ? (
        <Header
          title="My Lists"
          svg={<IonCreate />}
          action={handleCreateList}
        />
      ) : (
        <Header
          title="All Lists"
          svg={<IonCreate />}
          action={handleCreateList}
        />
      )}
      <ManageLabels
        renameAction={handleRenameList}
        deleteAction={handleDeleteList}
        givenItem="Lists"
        data={lists}
      />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
