import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { deleteCard, updateCard } from "@/utils/trello/cards";
import { useDispatch } from "react-redux";
import { editTrelloCards } from "@/store/slices/trelloItemsSlice";
import { Toast } from "toastify-react-native";
import { useState } from "react";
import { CardPopup } from "./CardPopup";
import { activeTrigger } from "@/store/slices/triggerSlice";

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
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleDeleteCard = async (cardId: string) => {
    const response = await deleteCard(cardId);
    if (response) dispatch(editTrelloCards({ cardId, cards: data || [] }));
    dispatch(activeTrigger(true));
    Toast.success("Card deleted !");
  };

  const renameCard = async (cardId: string) => {
    Alert.prompt("Rename card", "Type card's new name.", async (name) => {
      const response = await updateCard(cardId, name);
      if (response) {
        dispatch(activeTrigger(true));
        Toast.success("Card renamed.");
      } else Toast.error("Error during card rename.");
    });
  };

  const ButtonAction = ({
    onPress,
    label,
    backgroundColor,
  }: {
    onPress: () => void;
    label: string;
    backgroundColor: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionButton, { backgroundColor }]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
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

          <GestureHandlerRootView style={{ flex: 1 }}>
            {hasData && Array.isArray(data) && (
              <View>
                <View>
                  <LinearGradient
                    colors={["rgb(3, 25, 45)", "rgb(5, 108, 152)"]}
                    start={{ x: 0, y: 0 }}
                    style={[styles.newCardBtn]}
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
                        <Swipeable
                          key={current.id}
                          renderLeftActions={() => (
                            <>
                              <ButtonAction
                                onPress={() => renameCard(current.id)}
                                label="Rename"
                                backgroundColor="orange"
                              />
                              <ButtonAction
                                onPress={() => setIsCardOpen(!isCardOpen)}
                                label="Read"
                                backgroundColor="#377ef6"
                              />
                              {isCardOpen && (
                                <CardPopup
                                  card={current}
                                  visible={isCardOpen}
                                  onClose={() => setIsCardOpen(false)}
                                />
                              )}
                            </>
                          )}
                          renderRightActions={() => (
                            <>
                              <ButtonAction
                                onPress={() => handleDeleteCard(current.id)}
                                label="Delete"
                                backgroundColor="rgb(255, 53, 53)"
                              />
                            </>
                          )}
                        >
                          <LinearGradient
                            colors={["rgb(62, 84, 119)", "rgb(34, 40, 49)"]}
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
                              ></TouchableOpacity>
                            </View>
                          </LinearGradient>
                        </Swipeable>
                      ))
                    ) : (
                      <Text>No cards yet</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </GestureHandlerRootView>
        </TouchableOpacity>
      </LinearGradient>
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
  cardContainer: {
    marginTop: 20,
  },
  cards: {
    height: Dimensions.get("screen").height * 0.09,
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
    height: Dimensions.get("screen").height * 0.07,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#7791A3",
    padding: 20,
    marginBottom: 5,
  },
  newCardBtn: {
    borderWidth: 1,
    borderColor: "#fff",
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20,
    borderRadius: 100,
  },
  newCardText: {
    fontSize: 14,
    color: "#fff",
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
});
