import { Header } from "@/components/trello/Header";
import { createOrganization } from "@/utils/trello/organizations";
import { useNavigation } from "expo-router";
import { View, Text, StyleSheet, Alert } from "react-native";
import ToastManager, { Toast } from "toastify-react-native";
import { PageWorkpaces } from "./PageWorspaces";

export const PageHome = () => {
  const navigation = useNavigation();

  return (
      <View style={styles.container}>
          <PageWorkpaces />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "auto",
    backgroundColor: "#fff",
  },
  subContainer: {
    borderWidth: 1,
    borderColor: '#fff',
    width: "auto"
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#EEEEEE",
  },
});
