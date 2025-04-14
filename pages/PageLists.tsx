import { IonCreate } from "@/components/icons/IonCreate";
import { Header } from "@/components/trello/Header";
import store, { RootState } from "@/store";
import { activeTrigger } from "@/store/slices/triggerSlice";
import { archiveList, createListByBoardId, getLists, getListsByBoardId, renameList } from "@/utils/trello/lists";
import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ImageBackground, Text, Touchable, TouchableOpacity, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import { ManageLabels } from "./ManageLabels";
import { getBoards } from "@/utils/trello/boards";
import { setBottomBarColor } from "@/store/slices/colorsSlice";

interface PageListsProps {
  displayAllLists?: boolean;
}

export const PageLists: React.FC<PageListsProps> = ({ displayAllLists }) => {
  const dispatch = useDispatch();
  const [lists, setLists] = useState<any[]>([]);
  const boardId = store.getState().board.data.id;
  const [gettedBoardId, setGettedBoardId] = useState(boardId);
  const trigger = useSelector((state: RootState) => state.activeTrigger);
  const dynamicBackgroundColor = useSelector(
    (state: RootState) => state.color.activeColor
  );
  const [isPopupActive, setIsPopupActive] = useState<boolean>(false);
  const [boards, setBoards] = useState<any[]>([]);

  const fetchBoards = async () => {
    const boards = await getBoards();
    if (boards) setBoards(boards);
  };

  useEffect(() => {
    if (isPopupActive) {
      fetchBoards();
    }
  }, [isPopupActive]);

  useEffect(() => {
    console.log("Boards => " + boards);
  }, [fetchBoards]);

  useEffect(() => {
    dispatch(setBottomBarColor("black"));
  }, [dynamicBackgroundColor]);

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

  const handleCreateList = async (boardId: string) => {
    Alert.prompt("New List", "Type the list's name.", async (name) => {
      const response = await createListByBoardId(name, boardId);
      if (response) {
        await fetchLists();
        dispatch(activeTrigger(true));
      } else Toast.error("Error during list creation.");
    });
  };

  const handleRenameList = async (listID: string, currentName?: string) => {
    Alert.prompt(
      "Rename board",
      "Type List's new name.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async (name) => {
            const response = await renameList(listID, name);
            if (response) {
              dispatch(activeTrigger(true));
            } else Toast.error("Error during List's rename.");
          },
        },
      ],
      "plain-text",
      `${currentName}`
    );
  };

  const handleArchiveList = async (listID: string) => {
    const response = await archiveList(listID);
    if (response) {
      dispatch(activeTrigger(true));
    } else Toast.error("Error during archiving List.");
  };

  useEffect(() => {
    dispatch(activeTrigger(false));
    fetchLists();
    dispatch(activeTrigger(false));
  }, [trigger]);

  return (
    <ImageBackground
      source={require("@/assets/images/background.jpg")}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
      {!displayAllLists ? (
        <Header
        title="Boards"
        svg={<IonCreate />}
        action={() => handleCreateList(boardId)}
        />
      ) : (
        <Header
        title="All Lists"
        svg={<IonCreate />}
        action={() => setIsPopupActive(!isPopupActive)}
        hideArrow
        />
      )}
      <ManageLabels
        renameAction={handleRenameList}
        deleteAction={handleArchiveList}
        givenItem="Lists"
        isList={true}
        customLabel="Archive"
        data={lists}
      />
      </View>
      {isPopupActive && (
      <View
        style={{
        width: "90%",
        backgroundColor: "#333",
        bottom: Dimensions.get("window").height * 0.3,
        height: "50%",
        margin: "auto",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
        }}
      >
        <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#fff",
          marginBottom: 10,
          textAlign: "center",
        }}
        >
        Choose a board
        </Text>
        <View
        style={{
          backgroundColor: "#444",
          borderRadius: 10,
          padding: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
        >
        {boards.map((board) => (
          <TouchableOpacity
          key={board.id}
          style={{
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#555",
          }}
          onPress={() => handleCreateList(board.id)}
          >
          <Text
            style={{
            fontSize: 16,
            fontWeight: "500",
            color: "#1e90ff",
            }}
          >
            {board.name}
          </Text>
          </TouchableOpacity>
        ))}
        </View>
      </View>
      )}
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
});
