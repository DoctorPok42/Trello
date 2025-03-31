import { Cards } from "@/components/trello/card";
import { createBoard } from "@/utils/trello/boards";
import { createOrganization } from "@/utils/trello/organizations";
import { useNavigation } from "expo-router";
import { View, Text, StyleSheet, Alert } from "react-native";
import ToastManager, { Toast } from "toastify-react-native";

export const PageHome = () => {
  const navigation = useNavigation();

  const handleCreateOrganization = async () => {
    Alert.prompt("New workspace", "Type workspace's name.", async (displayName) => {
      let response = await createOrganization(displayName)
      if (displayName)  response ? Toast.success("Workspace created") : Toast.error("Error during Workspace creation.")
      if (response) navigation.navigate("PageWorkspaces" as never)
    });
  }

  return (
    <>
      <ToastManager />
      <View style={styles.container}>
        <Text style={styles.text}>Welcome</Text>
        <View>
        <Cards title="My workspaces" onPress={() => navigation.navigate("PageWorkspaces" as never)}/>
        <Cards title="Create a workspace" onPress={handleCreateOrganization}/>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D2125",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#EEEEEE",
  },
});

{/* <Cards title="Create a board" onPress={handleCreateBoard}/>
<Cards title="See all boards" onPress={() => navigation.navigate("PageBoards" as never)}/> */}