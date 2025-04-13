import { View, StyleSheet, ImageBackground } from "react-native";
import { PageWorkspaces } from "./PageWorkspaces";

export const PageHome = () => {
  return (
    <ImageBackground source={require("@/assets/images/background.png")} style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageWorkspaces />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "auto",
  },
  subContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    width: "auto",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#EEEEEE",
  },
});
