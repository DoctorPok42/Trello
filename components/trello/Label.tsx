import { Text, StyleSheet, TouchableOpacity, View, GestureResponderEvent, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PageCards } from "@/pages/PageCards";
import { useState } from "react";
import { Card } from "@/types/Card";

interface CardsProps {
  title?: string;
  onPress?: () => void;
  editCard?: (id: string) => void;
  creationDate?: string;
  hideArrow?: boolean;
  svg?: JSX.Element;
  hasData?: boolean;
  data?: any[];
  noRoundBorder?: boolean;
  handleCreateCard?: (event: GestureResponderEvent) => void;
  listId?: string;
  card?:Card;
}

export const Label: React.FC<CardsProps> = ({ title, onPress, creationDate, hideArrow = false, svg, noRoundBorder = false, listId, data, card }) => {
  let noRoundStyle = {};
  if (noRoundBorder) noRoundStyle = { borderRadius: 10 };
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View>
      {listId ? (
        <>
          <LinearGradient
            colors={["rgb(0, 70, 120)", "rgb(29, 77, 66)"]}
            start={{ x: 0, y: 0 }}
            style={[styles.cards, noRoundStyle]}
          >
            <TouchableOpacity
              style={styles.subContainer}
              onPress={() => setIsOpen(!isOpen)}
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
            </TouchableOpacity>
            {isOpen && (
                <PageCards listId={listId ? listId : ""} cardsList={data!}/>
            )}
          </LinearGradient>
        </>
      ) : (
        <>
          <LinearGradient
            colors={["rgb(0, 70, 120)", "rgb(13, 160, 128)"]}
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
            </TouchableOpacity>
          </LinearGradient>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subContainer: {
    width: "100%",
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
  },
  cards: {
    height: "auto",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#7791A3",
  },
  cardsTitleStyle: {
    fontSize: 16,
    color: "rgb(255, 255, 255)",
    fontWeight: "700",
  },
  cardSubContainer: {
    height: Dimensions.get("screen").height * 0.7,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#7791A3",
    padding: 20,
    marginBottom: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    textAlign: "left",
    justifyContent: "center",
  },
  textSmall: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0F5D81",
    textAlign: "left",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.25,
    height: Dimensions.get("screen").height * 0.07,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  newCardText: {
    fontSize: 14,
    color: "#fff",
  },
});
