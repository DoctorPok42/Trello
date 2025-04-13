import { View, StyleSheet } from "react-native";
import { PageWorkspaces } from "./PageWorkspaces";

export const PageHome = () => {
  return (
      <View style={styles.container}>
          <PageWorkspaces />
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
