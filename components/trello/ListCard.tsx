import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  GestureResponderEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialSymbolsEditSquareOutlineRounded } from "../icons/MaterialSymbolsEditSquareOutlineRounded";

interface CardsProps {
  title?: string;
  onPress?: () => void;
  editCard?: (id: string) => void;
  handleCreateCard?: (event: GestureResponderEvent) => void;
  creationDate?: string;
  hideArrow?: boolean;
  svg?: JSX.Element;
  hasData?: boolean;
  data?: any[];
  noRoundBorder?: boolean;
}

export const ListCard: React.FC<CardsProps> = ({
  title,
  onPress,
  editCard,
  handleCreateCard,
  creationDate,
  hideArrow = false,
  svg,
  hasData = false,
  data,
  noRoundBorder = false,
}) => {
  let noRoundStyle = {};
  if (noRoundBorder) noRoundStyle = { borderRadius: 10 };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgb(0, 70, 120)", "rgb(91, 134, 164)"]}
        start={{ x: 0, y: 0 }}
        style={[styles.cards, noRoundStyle]}
      >
        <TouchableOpacity
          style={styles.subContainer}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.textSmall}>{creationDate}</Text>
            {!hideArrow && svg}
          </View>

          {hasData && Array.isArray(data) && (
            <View>
              <View>
                <LinearGradient
                  colors={["rgb(0, 70, 120)", "rgb(91, 134, 164)"]}
                  start={{ x: 0, y: 0 }}
                  style={[styles.newCardBtn, noRoundStyle]}
                >
                  <TouchableOpacity
                    onPress={(event) => handleCreateCard!(event)}
                  >
                    <Text style={styles.newCardText}>New card</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View style={styles.cardContainer}>
                <View>
                  {data.length > 0 ? (
                    data.map((current) => (
                      <LinearGradient
                        key={current.id}
                        colors={["rgb(0, 152, 169)", "rgb(226, 72, 253)"]}
                        start={{ x: 0, y: 0 }}
                        style={styles.cardSubContainer}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.cardsTitleStyle}>
                            {current.name}
                          </Text>
                          <TouchableOpacity
                            onPress={() => editCard?.(current.id)}
                          >
                            <MaterialSymbolsEditSquareOutlineRounded />
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    ))
                  ) : (
                    <Text>No cards yet</Text>
                  )}
                </View>
              </View>
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
    fontSize: 16,
    color: "rgb(255, 255, 255)",
    fontWeight: 700,
  },
  cardSubContainer: {
    height: "auto",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#7791A3",
    padding: 20,
    marginBottom: 5
  },
  newCardBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    alignSelf: "flex-end",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20
  },
  newCardText: {
    fontSize: 14,
    color: "#fff",
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
