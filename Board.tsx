import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { trelloAPI } from './App';
import { ActivityIndicator, Divider, Searchbar } from 'react-native-paper';
import { AddButton } from './components';

interface BoardProps {
  route: any;
}

const WINDOW_WIDTH = Dimensions.get('window').width;

const Board = ({
  route
}: BoardProps) => {
  const { id, name } = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lists, setLists] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [savedCards, setSavedCards] = useState<any[]>([]);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      // const responseLists = await trelloAPI.getLists(id);
      // setLists(responseLists);

      const responseCards = await trelloAPI.getCards(id);
      setCards(responseCards);
      setSavedCards(responseCards);
    } catch (err: any) {
      console.log(err.message || 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCards();
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filteredCards = cards.filter(card => card.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setCards(filteredCards);
    } else {
      setCards(savedCards);
    }
  }, [searchQuery]);

  return (
    <View style={styles.Board_container}>
      <View style={styles.tooltip}>
          <AddButton onPress={() => setVisible(true)} />
      </View>
      <View>
        <Searchbar
          placeholder="Search..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={() => {}}
          style={{ marginHorizontal: 10, backgroundColor: '#fff', marginBottom: 10 }}
        />
      </View>

      {isLoading
        ?
          <ActivityIndicator size={35} color="#0079BF" />
        :
      cards.map((card, index) => (
        <View key={card.id + card.name} style={{ padding: 10 }}>
          <View style={styles.header}>
            {/* <FontAwesome name="icon-name" size={20} color="#4F8EF7" /> */}
            {card.dueComplete ? <Text>✅</Text> : <Text>❌</Text>}
            <Text style={styles.title}>{
              card.name.length > 30
                ? `${card.name.substring(0, 30)}...`
                : card.name
              }</Text>
          </View>

          {<Divider />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tooltip: {

  },

  Board_container: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingBottom: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    overflow: 'hidden',
  }
});

export default Board;