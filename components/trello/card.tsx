import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface CardsProps {
  title: string;
  onPress?: () => void;
}

export const Cards: React.FC<CardsProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
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
