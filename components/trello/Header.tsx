import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface HeaderProps {
  title?: string;
  svg?: JSX.Element;
  action?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, svg, action }) => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <View>
          <Text style={styles.text}>{title}</Text>
        </View>
        <TouchableOpacity onPress={action}>{svg}</TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    width: "100%",
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 23,
    fontWeight: 400,
    color: "#ffffff",
    textAlign: "left",
  },
});
