import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const PageHome = () => {
  const navigation = useNavigation();

  const navigateToWorkspaces = () => {
    navigation.navigate("workspaces" as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hello</Text>
      <TouchableOpacity style={styles.button} onPress={navigateToWorkspaces}>
        <Text style={styles.buttonText}>Let's get started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "300", 
    color: "#FFFFFF",
    marginBottom: 30,
    letterSpacing: 1,
  },
  button: {
    width: 180,
    height: 50,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
