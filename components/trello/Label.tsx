import { Text, StyleSheet, TouchableOpacity, View, GestureResponderEvent, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PageCards } from "@/pages/PageCards";
import { useState } from "react";
import { Card } from "@/types/Card";
import { MaterialSymbolsArrowCircleRightOutline } from "../icons/MaterialSymbolsArrowCircleRightOutline";
import { MaterialSymbolsArrowDropDownCircleOutline } from "../icons/MaterialSymbolsArrowDropDownCircleOutline";
import { IonIosArrowDropupCircle } from "../icons/IonIosArrowDropupCircle";

interface CardsProps {
  title?: string;
  onPress?: () => void;
  editCard?: (id: string) => void;
  creationDate?: string;
  hideArrow?: boolean;
  svg?: JSX.Element;
  hasData?: boolean;
  data?: any[];
  handleCreateCard?: (event: GestureResponderEvent) => void;
  listId?: string;
  card?: Card;
  item?: any;
}

export const Label: React.FC<CardsProps> = ({
  title,
  onPress,
  creationDate,
  svg,
  listId,
  data,
  card,
  item
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View>
      {listId ? (
        <>
          <LinearGradient
            colors={["rgb(8, 15, 23)", "rgb(8, 15, 23)", "rgb(8, 15, 23)", "rgb(21, 52, 87)", "rgb(3, 25, 50)"]}
            start={{ x: 0, y: 0 }}
            style={card ? [styles.cards, { height: "auto" }] : [{paddingBottom: 10}]}
          >
            <TouchableOpacity
              style={[styles.subContainer]}
              onPress={() => {
                setIsOpen(!isOpen)
              }}
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
                {isOpen ? <IonIosArrowDropupCircle /> : <MaterialSymbolsArrowDropDownCircleOutline />}
              </View>
            </TouchableOpacity>
            {isOpen && (
              <PageCards listId={listId ? listId : ""} cardsList={data!} />
            )}
          </LinearGradient>
        </>
      ) : (
        <>
          <LinearGradient
            colors={["rgb(18, 25, 28)", "rgb(52, 67, 91)"]}
            start={{ x: 0, y: 0 }}
            style={ card ? [styles.cards, {marginBottom: 5, borderWidth: 1}] : [styles.cards]} >
            <TouchableOpacity
              style={styles.subContainer}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.text}>{title}</Text>
                <Text style={styles.textSmall}>{creationDate}</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cards: {
    borderColor: "#7791A3",
  },
  text: {
    fontSize: 18,
    fontWeight: "400",
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
});
