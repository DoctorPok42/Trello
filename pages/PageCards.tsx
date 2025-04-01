import { Cards } from "@/components/trello/Card";
import store from "@/store";
import { createCardInList, getCardsFromList } from "@/utils/trello/cards";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Toast } from "toastify-react-native";

export const PageCards = () => {
  const [cards, setCards] = useState<any[]>();
  const [listId, setListId] = useState(store.getState().list.data.id);

  const fetchCards = async () => {
    const responseData = await getCardsFromList(listId);
    if (responseData) setCards(responseData);
  };

  const handleCreateCard = () => {
    Alert.prompt("New Card", "Type card's name.", async (name) => {
      const response = await createCardInList(name, listId);
      response ? Toast.success("Card created.") : Toast.error("Error during card creation.");
    });
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Liste des cartes</Text>
      {cards?.map((card, index) => (
        <Cards title={card.name} key={index} />
      ))}
      <Cards title="Create a card" onPress={handleCreateCard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
});
