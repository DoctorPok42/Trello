import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface CardsProps {
  title?: string;
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
    width: 150,  // Taille fixe pour un carré
    aspectRatio: 1, // Assure que la hauteur = largeur
    backgroundColor: "#00ADB5",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EEEEEE",
    textAlign: "center",
  },
});
