import { Cards } from "@/components/trello/card";
import store, { RootState } from "@/store";
import { setBoardData } from "@/store/slices/boardSlice";
import { createBoard, createBoardByOrganizationId, getBoards } from "@/utils/trello/boards";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

export const PageBoards = () => {
  const [boards, setBoards] = useState<any[]>();
  const [organizationId, setOrganizationId] = useState(store.getState().organization.data.id);
  const board = useSelector((state: RootState) => state.board.data);
  const navigation = useNavigation();
  const dispatch = useDispatch();

    const fetchBoards = async () => {
      const responseData = await getBoards(organizationId);
      if (responseData) setBoards(responseData);
    };
  
    const handleCreateBoard = () => {
      Alert.prompt("New board", "Type board's name.", async (name) => {
        if (name) await createBoardByOrganizationId(name, organizationId) 
          ? Toast.success("Board created.") : Toast.error("Error during board creation.")
      });
      navigation.navigate("PageLists" as never)
    }
    
    const handleSelectBoard = (boardId: string) => {
      dispatch(setBoardData({ ...board, id: boardId }))
      navigation.navigate("PageLists" as never)
    };

    useEffect(() => {
      fetchBoards();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Liste des tableaux</Text>
      {boards?.map((board, index) => (
        <Cards title={board.name} key={index} onPress={() => handleSelectBoard(board.id)}/>
      ))}
      <Cards title="Create a board" onPress={handleCreateBoard}/>
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
