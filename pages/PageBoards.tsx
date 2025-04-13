import { IonCreate } from "@/components/icons/IonCreate";
import { Header } from "@/components/trello/Header";
import store, { RootState } from "@/store";
import { setBoardData } from "@/store/slices/boardSlice";
import { createBoardByOrganizationId, deleteBoard, getBoards, getBoardsByID, updateBoard } from "@/utils/trello/boards";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Alert, View, ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import { ManageLabels } from "./ManageLabels";
import { activeTrigger } from "@/store/slices/triggerSlice";
import { setBottomBarColor } from "@/store/slices/colorsSlice";

interface BoardsProps {
  displayAllBoards?: boolean;
}

export const PageBoards: React.FC<BoardsProps> = ({
  displayAllBoards = false,
}) => {
  const [boards, setBoards] = useState<any[]>([]);
  const board = useSelector((state: RootState) => state.board.data);
  const trigger = useSelector((state: RootState) => state.activeTrigger);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [organizationId, setOrganizationId] = useState<string>(store.getState().organization.id);
  const [organizationName, setOrganizationName] = useState(store.getState().organization.name);
  const dynamicBackgroundColor = useSelector((state: RootState) => state.color.activeColor);
  
  useEffect(() => {
    dispatch(setBottomBarColor("transparent"));
  }, [dynamicBackgroundColor]);

  const fetchBoards = async () => {
    if (!displayAllBoards) {
      const responseData = await getBoardsByID(organizationId);
      if (responseData) setBoards(responseData);
    } else {
      const responseData = await getBoards();
      if (responseData) setBoards(responseData);
    }
  };

  const handleCreateBoard = async () => {
    Alert.prompt("New board", "Type board's name.", async (name) => {
      const response = await createBoardByOrganizationId(name, organizationId);
      if (response) {
        await fetchBoards();
      } else Toast.error("Error during board creation.");
    });
  };

  const handleSelectBoard = (boardId: string) => {
    const dataToSet = { ...board, id: boardId };
    dispatch(setBoardData(dataToSet));
    navigation.navigate("PageLists" as never);
  };

  const handleRenameBoard = async (boardID: string) => {
    Alert.prompt("Rename board", "Type board's new name.", async (name) => {
      const response = await updateBoard(boardID, name);
      if (response) {
        dispatch(activeTrigger(true));
      } else Toast.error("Error during board's rename.");
    });
  };

  const handleDeleteBoard = async (boardID: string) => {
    const response = await deleteBoard(boardID);
    if (response) {
      dispatch(activeTrigger(true));
    } else Toast.error("Error during deleting board.");
  };

  useEffect(() => {
    fetchBoards();
    dispatch(activeTrigger(false));
  }, [trigger]);

  return (
    <ImageBackground source={require("@/assets/images/background.jpg")} style={{ flex: 1 }}>
    <View style={styles.container}>
      <View>
        {displayAllBoards ? (
          <Header
            title="All Boards"
            svg={<IonCreate />}
            action={handleCreateBoard}
            hideArrow
          />
        ) : (
          <Header
            title={`Workspaces`}
            svg={<IonCreate />}
            action={handleCreateBoard}
          />
        )}
      </View>
      <ManageLabels
        renameAction={handleRenameBoard}
        deleteAction={handleDeleteBoard}
        redirectAction={handleSelectBoard}
        givenItem="Boards"
        data={boards}
      />
    </View>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
  },

  noBoard: {
    color: "gray",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
});