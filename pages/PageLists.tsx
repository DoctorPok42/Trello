import { Cards } from "@/components/trello/card";
import store from "@/store";
import { createListByBoardId, getListsByBoardId } from "@/utils/trello/lists";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Toast } from "toastify-react-native";

export const PageLists = () => {
  const [lists, setLists] = useState<any[]>();
  const [boardId, setBoardId] = useState(store.getState().board.data.id);

    const fetchLists = async () => {
      const responseData = await getListsByBoardId(boardId);
      if (responseData) setLists(responseData);
    };
  
    const handleCreateList = () => {
      Alert.prompt("New List", "Type the list's name.", async (name) => {
        if (name) await createListByBoardId(name, boardId) 
          ? Toast.success("List created.") : Toast.error("Error during list creation.")
      });
    }
    
     useEffect(() => {
      fetchLists();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Lists</Text>
       {lists?.map((list, index) => (
        <Cards title={list.name} key={index}/>
      ))} 
      <Cards title="Create a list" onPress={handleCreateList}/>
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
