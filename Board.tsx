import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, RefreshControl, Alert, Button } from 'react-native';
import { trelloAPI } from './App';
import { List, Modal, PaperProvider, Portal, Searchbar, SegmentedButtons, TextInput } from 'react-native-paper';
import { AddButton, Card, Snackbar } from './components';
import { useNavigation } from '@react-navigation/native';

interface BoardPageProps {
  route: any;
}

const BoardPage = ({
  route
}: BoardPageProps) => {
  const navigation = useNavigation() as any;
  const { id, name } = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lists, setLists] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [boardMembers, setBoardMembers] = useState<any[]>([]);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [visible, setVisible] = useState<"card" | "list" | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [value, setValue] = useState<"card" | "list">('card');
  const [listOpen, setListOpen] = useState<number>(-1);
  const [alert, setAlert] = useState<{ visible: boolean, message: string }>({ visible: false, message: '' });

  const containerStyle = {
    backgroundColor: 'white',
    padding: 10,
    margin: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width - 40,
  };

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const responseCards = await trelloAPI.getCards(id);
      setCards(responseCards);
      setSavedCards(responseCards);

      const responseLists = await trelloAPI.getLists(id);
      setLists(responseLists);

      const responseMembers = await trelloAPI.getBoardMembers(id);
      setBoardMembers(responseMembers);
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

  const onRefresh = async () => {
    await fetchCards();
  }

  const handleAdd = async (name: string) => {
    if (visible === "list") {
      if (isEditing) {
        await trelloAPI.updateList(lists[0].id, name).then(() => {
          setVisible(null);
          setSearchQuery('');
        });
      } else {
        await trelloAPI.createList(id, name).then(() => {
          setVisible(null);
          setSearchQuery('');
        });
      }
    } else if (visible === "card") {
      await trelloAPI.createCard(lists[0].id, name).then(() => {
        setVisible(null);
        setSearchQuery('');
      });
    }
    setIsEditing(null);
    setListOpen(-1);
    setAlert({ visible: true, message: `${visible === "list" ? "List" : "Card"} created successfully` });
    onRefresh();
  }

  const handleDeleteCard = async (id: string) => {
    await trelloAPI.deleteCard(id).then(() => {
      setAlert({ visible: true, message: 'Card deleted successfully' });
      onRefresh();
    });
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
    <PaperProvider>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={['#0079BF', '#D29034', '#519839', '#B04632', '#89609E']} />
        }
      >
        <View style={styles.Board_container}>
          <AddButton options={[
            { icon: "format-list-bulleted", label: 'Create list', onPress: () => setVisible("list") },
            { icon: "card-bulleted", label: 'Create card', onPress: () => setVisible("card") },
          ]} />

          <View>
            <Searchbar
              placeholder="Search..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{ marginHorizontal: 10, backgroundColor: '#fff', marginBottom: 10 }}
            />
          </View>

          <SegmentedButtons
            value={value}
            onValueChange={setValue as any}
            style={{
              marginTop: 10,
              marginHorizontal: 10,
              marginBottom: 10,
            }}
            theme={
              {
                colors: {
                  secondaryContainer: '#0079BF',
                  onSecondaryContainer: '#fff',
                },
              }
            }
            buttons={[
              {
                value: 'card',
                label: 'Cards',
                icon: 'card-bulleted',
              },
              {
                value: 'list',
                label: 'List',
                icon: 'format-list-bulleted',

              },
            ]}
          />

          {value === "card" && cards.map((card) => (
            <View key={card.id}>
              <Card
                name={card.name}
                dueDate={card.due}
                dueComplete={card.dueComplete}
                onCardPress={() => navigation.navigate('Card', { id: card.id, name: card.name, parentName: name, lists, cardParent: card, boardMembers })}
                onLongPress={(name: string) => {
                  Alert.alert(
                    'Delete card',
                    `Are you sure you want to delete the card "${name}"?`,
                    [
                      {
                        text: 'Cancel',
                        onPress: null,
                        style: 'cancel'
                      },
                      {
                        text: 'Delete',
                        onPress: () => { handleDeleteCard(card.id) }
                      }
                    ]
                  )
                }}
              />
            </View>
          ))}

          {value === "list" && lists.map((list, index) => (
            <View key={list.id}>
              <List.Accordion
                title={list.name}
                style={{
                  marginBottom: 10,
                }}
                left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
                expanded={listOpen === index}
                onPress={() => setListOpen(listOpen === index ? -1 : index)}
              >
                <List.Item
                  title="Edit list"
                  description="Edit the list name"
                  left={props => <List.Icon {...props} icon="pencil" />}
                  onPress={() => {
                    setIsEditing(list.name);
                    setVisible("list")
                  }}
                />
                <List.Item
                  title="Delete list"
                  description="Delete the list"
                  left={props => <List.Icon {...props} icon="delete" />}
                  onPress={() => Alert.alert(
                    'Delete list',
                    `Are you sure you want to delete the list "${list.name}"?`,
                    [
                      {
                        text: 'Cancel',
                        onPress: null,
                        style: 'cancel'
                      },
                      {
                        text: 'Delete',
                        onPress: () => { trelloAPI.deleteList(list.id).then(() => onRefresh()) }
                      }
                    ]
                  )}
                />
              </List.Accordion>
            </View>
          ))}

          {(cards.length === 0 && !!searchQuery) && (
            <>
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No cards found</Text>
            <Button title='Create a card' onPress={() => setVisible("card")} color='#007AFF' />
            </>
          )}

          <Portal>
            <Modal visible={visible !== null} onDismiss={() => setVisible(null)} contentContainerStyle={containerStyle}>
              <TextInput
                mode="outlined"
                placeholder={
                  visible === "list" ? "List name" : "Card name"
                }
                {...(visible === "list" && { value: isEditing })}
                {...isEditing && { onChangeText: setIsEditing }}
                autoFocus
                onSubmitEditing={(e) => handleAdd(e.nativeEvent.text)}
              />
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </PaperProvider>

      <Snackbar
        visible={alert.visible}
        message={alert.message}
        onDismiss={() => setAlert({ visible: false, message: '' })}
        duration={3000}
        actions={[
          { label: 'OK', onPress: () => setAlert({ visible: false, message: '' }) },
        ]}
      />
    </View>
  );
};

const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  Board_container: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingBottom: 10,
  },

  floatingButton: {
    top: WINDOW_HEIGHT - 150,
    right: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    overflow: 'hidden',
  },

  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  }
});

export default BoardPage;