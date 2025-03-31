import { Cards } from "@/components/trello/card";
import { createBoard } from "@/utils/trello/board";
import { createOrganization } from "@/utils/trello/organizations";
import { useNavigation } from "expo-router";
import { View, Text, StyleSheet, Alert } from "react-native";
import ToastManager, { Toast } from "toastify-react-native";

export const PageHome = () => {
  const navigation = useNavigation();
  
  const handleCreateBoard = () => {
    Alert.prompt("Nouveau tableau", "Indiquez le nom du tableau.", (name) => {
      if (name) {
        createBoard(name) ? Toast.success("Tableau crée") : Toast.error("Tableau non crée.")
      }
    });
  }

  const handleCreateOrganization = () => {
    Alert.prompt("Nouvelle organisation", "Indiquez le nom de l'organisation.", (name) => {
      if (name) {
        const response = (createOrganization(name));
        response ? Toast.success("Organisation crée") : Toast.error("Organisation non crée.")
      }
    });
  }

  return (
    <>
      <ToastManager />
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenue</Text>
        <View>
        <Cards title="Créer un tableau" onPress={handleCreateBoard}/>
        <Cards title="Voir mes tableaux" onPress={() => navigation.navigate("PageBoards" as never)}/>
        <Cards title="Créer une organisation" onPress={handleCreateOrganization}/>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 8,
    backgroundColor: "#393E46",
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