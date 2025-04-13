import { RootState } from "@/store";
import { getCardsFromList, createCardInList, updateCard, deleteCard } from "@/utils/trello/cards";
import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, GestureResponderEvent, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import { ManageLabels } from "./ManageLabels";
import { Card } from "@/types/Card";
import { LinearGradient } from "expo-linear-gradient";
import { activeTrigger } from "@/store/slices/triggerSlice";

interface CardsProps {
  listId: string;
  cardsList: Card[];
}

export const PageCards: React.FC<CardsProps> = ({ listId, cardsList }) => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState<Card[]>(cardsList);
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const trigger = useSelector((state:RootState) => state.activeTrigger.activeTrigger);

  const fetchCards = async () => {
    const responseData = await getCardsFromList(listId);
    if (responseData) setCards(responseData);
  };

  const handleCreateCard = (event: GestureResponderEvent) => {
    event.stopPropagation();
    Alert.prompt("New Card", "Type card's name.", async (name) => {
      const response = await createCardInList(
        name,
        listId
      );
      if (response) {
        await fetchCards();
        Toast.success("Card created.");
      } else Toast.error("Error during card creation.");
    });
  };

  const handleRenameCard = async (cardID: string) => {
    Alert.prompt("Rename card", "Type List's new name.", async (name) => {
      const response = await updateCard(cardID, name);
      if (response) {
        dispatch(activeTrigger(true));
        Toast.success("Card renamed.");
      } else Toast.error("Error during List's rename.");
    });
  };

  const handleDeleteCard = async (cardID: string) => {
    const response = await deleteCard(cardID);
    if (response) {
      dispatch(activeTrigger(true));
      Toast.success("Card deleted.");
    } else Toast.error("Error during deleting List.");
  };

  useEffect(() => {
    fetchCards();
    dispatch(activeTrigger(false));
  }, [trigger]);

  return (
    <>
      <View>
        <View>
          <LinearGradient
            colors={["rgb(3, 25, 45)", "rgb(4, 99, 140)"]}
            start={{ x: 0, y: 0 }}
            style={[styles.newCardBtn]}
          >
            {[
              <TouchableOpacity key="newCardButton" onPress={handleCreateCard}>
                <Text style={styles.newCardText}>New card</Text>
              </TouchableOpacity>,
            ]}
          </LinearGradient>
        </View>
        <View style={styles.cardContainer}>
        <ManageLabels
            redirectAction={() => setIsCardOpen(!isCardOpen)}
            openCard = {isCardOpen}
            renameAction={handleRenameCard}
            deleteAction={handleDeleteCard}
            givenItem="Cards"
            data={cards}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  noList: {
    color: "gray",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  cardContainer: {
    marginTop: 20,
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
});
