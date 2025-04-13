import { useNavigation } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialSymbolsArrowBackIosNew } from "../icons/MaterialSymbolsArrowBackIosNew";

interface HeaderProps {
  title?: string;
  svg?: JSX.Element;
  action?: () => void;
  hideArrow?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, svg, action, hideArrow=false }) => {
  const navigator = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
      {!hideArrow && 
       <TouchableOpacity onPress={() => navigator.goBack()}>
        <Text style={{ fontSize: 20, color: "#ffffff" }}><MaterialSymbolsArrowBackIosNew /></Text>
        </TouchableOpacity>}
        <Text style={[styles.text, { marginLeft: 10 }]}>{title}</Text>
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
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  text: {
    fontSize: 26,
    fontWeight: 400,
    color: "#ffffff",
    textAlign: "left",
  },
});
