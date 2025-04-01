import { Text, StyleSheet, TouchableOpacity, View, Animated, Easing, } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CardsProps {
  title?: string;
  onPress?: () => void;
  creationDate?: string;
  hideArrow?: boolean;
  svg?: JSX.Element;
  hasData?: boolean;
  data?: any[];
  noRoundBorder?: boolean;
}

export const ListCard: React.FC<CardsProps> = ({ title, onPress, creationDate, hideArrow = false, svg, hasData = false, data, noRoundBorder = false }) => {
  let noRoundStyle = {};
  if (noRoundBorder) noRoundStyle = { borderRadius: 5 };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["rgb(0, 70, 120)", "rgb(91, 134, 164)"]} start={{ x: 0, y: 0 }} style={[styles.cards, noRoundStyle]} >
        <TouchableOpacity style={styles.subContainer} onPress={onPress} activeOpacity={0.7} >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.textSmall}>{creationDate}</Text>
            {!hideArrow && svg}
          </View>
          {hasData && Array.isArray(data) && (
            <View style={styles.cardContainer}>
              {data.length > 0 ? (
                <View style={styles.cardSubContainer}>
                  {data.map((current) => (
                    <Text style={styles.cardsTitleStyle} key={current.id}>
                      {current.name} {current.description}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text>No cards yet</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  subContainer: {
    width: "100%",
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
  },
  cardContainer: {
    marginTop: 20,
  },
  cards: {
    marginTop: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#7791A3",
  },

  cardsTitleStyle: {
    fontSize: 18,
    fontWeight: 500,
  },
  cardSubContainer: {
    height: "auto",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#7791A3",
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 600,
    color: "#fff",
    textAlign: "left",
  },

  textSmall: {
    fontSize: 20,
    fontWeight: 600,
    color: "#0F5D81",
    textAlign: "left",
  },
});