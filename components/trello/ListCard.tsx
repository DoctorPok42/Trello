import { Text, StyleSheet, TouchableOpacity, View, GestureResponderEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { deleteCard } from "@/utils/trello/cards";
import { useDispatch } from "react-redux";
import { editTrelloCards } from "@/store/slices/trelloItemsSlice";
import { Toast } from "toastify-react-native";
import CardPopup from "./CardPopup";
import { useState } from "react";

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

export const ListCard: React.FC<CardsProps> = ({ title, onPress, editCard, handleCreateCard, creationDate, hideArrow = false, svg, hasData = false, data, noRoundBorder = false }) => {
  let noRoundStyle = {};
  if (noRoundBorder) noRoundStyle = { borderRadius: 10 };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleDeleteCard = async (cardId: string) => {
    const response = await deleteCard(cardId);
    if (response) dispatch(editTrelloCards({ cardId, cards: data || [] }));
    Toast.success("Card deleted !");
  };

  const ButtonAction = ({ onPress, label, backgroundColor }: { onPress: () => void; label: string; backgroundColor: string; }) => (
    <TouchableOpacity onPress={onPress} style={[styles.actionButton, { backgroundColor }]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );

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
                          renderRightActions={() => (
                            <>
                              <ButtonAction
                                onPress={() => handleDeleteCard(current.id)}
                                label="Delete"
                                backgroundColor="rgb(255, 53, 53)"
                              />
                              <ButtonAction
                                onPress={() => setIsOpen(!isOpen)}
                                label="Update"
                                backgroundColor="orange"
                              />
                              <ButtonAction
                                onPress={() => handleDeleteCard(current.id)}
                                label="Read"
                                backgroundColor="#377ef6"
                              />
                              {isOpen && (
                                <CardPopup
                                  cardId={current.id}
                                  visible={isOpen}
                                  onClose={() => setIsOpen(false)}
                                  onSave={(updatedData) => {
                                    console.log("Saved data:", updatedData);
                                    setIsOpen(false);
                                  }}
                                />
                              )}
                            </>
                          )}
                        >
                          <LinearGradient
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
    fontWeight: "700",
  },
  cardSubContainer: {
    height: "auto",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#7791A3",
    padding: 20,
    marginBottom: 5,
    borderRadius: 10,
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
    width: 80,
    height: 62,
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});