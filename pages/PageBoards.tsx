import { IonCreate } from "@/components/icons/IonCreate";
import { Cards } from "@/components/trello/Card";
import { Header } from "@/components/trello/Header";
import { ListCard } from "@/components/trello/ListCard";
import store, { RootState } from "@/store";
import { setBoardData } from "@/store/slices/boardSlice";
import {
  createBoard,
  createBoardByOrganizationId,
  getBoards,
} from "@/utils/trello/boards";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

export const PageBoards = () => {
  const [boards, setBoards] = useState<any[]>();
  const board = useSelector((state: RootState) => state.board.data);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const organizationId = store.getState().organization.data.id;

  const fetchBoards = async () => {
    const responseData = await getBoards(organizationId);
    if (responseData) setBoards(responseData);
  };

  const handleCreateBoard = () => {
    Alert.prompt("New board", "Type board's name.", async (name) => {
      const response = await createBoardByOrganizationId(name, organizationId);
      response
        ? Toast.success("Board created.")
        : Toast.error("Error during board creation.");
    });
  };

  const handleSelectBoard = (boardId: string) => {
    const dataToSet = { ...board, id: boardId };
    dispatch(setBoardData(dataToSet));
    navigation.navigate("PageLists" as never);
  };

  useEffect(() => {
    fetchBoards();
  }, [handleCreateBoard]);

  return (
    <View style={styles.container}>
      <Header
        title="My Boards"
        svg={<IonCreate />}
        action={handleCreateBoard}
      />

      {board && boards?.length ? (
        boards.map((board, index) => (
          <ListCard
            customHeight={160}
            title={board.name}
           /*  creationDate="" */
            hideArrow={true}
            key={index}
            onPress={() => handleSelectBoard(board.id)}
          />
        ))
      ) : (
        <Text style={styles.noBoard}>No board yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },

  noBoard: {
    color: "gray",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
});
