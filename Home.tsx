import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, RefreshControl, Alert, Vibration } from 'react-native';
import { Modal, Portal, Text, PaperProvider, TextInput, Searchbar } from 'react-native-paper';
import { AddButton, Board } from './components';
import { useNavigation } from '@react-navigation/native';
import { trelloAPI } from './App';

interface HomeProps {
  boards: {
    id: string;
    name: string;
  }[],
  setBoards: (boards: any) => void;
}

const Home = ({
  boards,
  setBoards,
}: HomeProps) => {
  const navigation = useNavigation() as any;

  const [boardss, setBoardss] = useState(boards);
  const [visible, setVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const containerStyle = {
    backgroundColor: 'white',
    padding: 10,
    margin: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width - 40,
  };

  const handleAddBoard = async (name: string) =>  {
    await trelloAPI.createBoard(name).then(() => {
      Vibration.vibrate(200);
    });
    setVisible(false)
    onRefresh();
  }

  const handleDeleteBoard = async (id: string) => {
    await trelloAPI.deleteBoard(id).then(() => {
      Vibration.vibrate(120);
    });
    onRefresh();
  }

  useEffect(() => {
    if (searchQuery) {
      const filteredBoards = boards.filter(board => board.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setBoardss(filteredBoards);
    } else {
      setBoardss(boards);
    }
  }, [searchQuery]);

   const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await trelloAPI.getBoards('me');
      setBoards(response);
      setBoardss(response);
    } catch (err: any) {
      console.log(err.message || 'Erreur inconnue');
    } finally {
      setRefreshing(false);
    }
   }, []);

  return (
      <PaperProvider>
        <View style={styles.tooltip}>
          <AddButton onPress={() => setVisible(true)} />
        </View>

        <View>
          <Searchbar
            placeholder="Search..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onIconPress={() => {}}
            style={{ marginTop: 20, marginHorizontal: 10, backgroundColor: '#fff' }}
          />
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0079BF', '#D29034', '#519839', '#B04632', '#89609E']} />
          }
        >
          <View style={styles.boardsContainer}>
            <Text style={styles.title}>Your board{boards.length > 1 ? 's' : ''}</Text>
            {boardss.map(board => (
              <Board
                key={board.id}
                board={board}
                onPress={(id, name) => navigation.navigate('Board', { id, name })}
                onLongPress={(id, name) => {
                  Alert.alert(
                    `Delete board "${name}"`,
                    'Are you sure you want to delete this board?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Delete',
                        onPress: () => { handleDeleteBoard(id); },
                      },
                    ],
                  );
                }}
              />
            ))}

            {boardss.length === 0 &&
              <Text style={{ fontSize: 20, color: 'gray', marginTop: 20 }}>
              {searchQuery ? 'No boards found for this search :(' : 'You don\'t have any boards yet\nStart by creating one!'}
              </Text>
            }
          </View>
        </ScrollView>

        <Portal>
          <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={containerStyle}>
            <TextInput mode="outlined" placeholder="Board name..." autoFocus onSubmitEditing={(e) => handleAddBoard(e.nativeEvent.text)} />
          </Modal>
        </Portal>
      </PaperProvider>
  );
};

const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    top: WINDOW_HEIGHT - 80,
    right: 15,
    zIndex: 1,
  },

  boardsContainer: {
    flex: 1,
    gap: 10,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    width: '100%',
    marginLeft: 34,
  },
});

export default Home;