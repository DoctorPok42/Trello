import { Cards } from "@/components/trello/card";
import store from "@/store";
import { createBoard, createBoardByOrganizationId, getBoards } from "@/utils/trello/boards";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Toast } from "toastify-react-native";

export const PageBoards = () => {
  const [boards, setBoards] = useState<any[]>();
  const [organizationId, setOrganizationId] = useState(store.getState().organization.data.id);

    const fetchBoards = async () => {
      const responseData = await getBoards(organizationId);
      if (responseData) setBoards(responseData);
    };
  
    const handleCreateBoard = () => {
      Alert.prompt("New board", "Type board's name.", async (name) => {
        if (name) await createBoardByOrganizationId(name, organizationId) 
          ? Toast.success("Board created.") : Toast.error("Error during board creation.")
      });
    }
    
    useEffect(() => {
      fetchBoards();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Liste des tableaux</Text>
      {boards?.map((board, index) => (
        <Cards title={board.name} key={index}/>
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
