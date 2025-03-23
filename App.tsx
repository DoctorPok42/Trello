import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Vibration, ScrollView, RefreshControl, Alert, Text, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './Login';
import { TrelloAPI } from "./trello_module";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Card from './Card';
import { PaperProvider, Portal, Searchbar, TextInput, Modal } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { AddButton, Board } from './components';
import BoardPage from './Board';

const apiKey = process.env.REACT_APP_TRELLO_API_KEY;
export const trelloAPI = new TrelloAPI(apiKey);

type Board = {
  id: string;
  name: string;
};

const containerStyle = {
  backgroundColor: 'white',
  padding: 10,
  margin: 20,
  borderRadius: 10,
  width: Dimensions.get('window').width - 40,
};

const TOKEN_STORAGE_KEY = "trello_token";

const Base = () => {
  const [start, setStart] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation() as any;

    const [boards, setBoards] = useState<any[]>([]);
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
    const [visible, setVisible] = useState<"Board" | "Workspace" | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [refreshing, setRefreshing] = useState<boolean>(true);
    const [edit, setEdit] = useState<string | null>(null);

    const getWorkspaces = async () => {
      try {
        setRefreshing(true);
        const response = await trelloAPI.getWorkspaces("me");
        setWorkspaces(response);
        setSelectedWorkspace(selectedWorkspace || response[0].id);

        const responseBoards = await trelloAPI.getBoards("me");
        setBoards(responseBoards);
      } catch (err: any) {
        console.log(err.message || 'Erreur inconnue');
      } finally {
        setRefreshing(false);
      }
    }

    const handleAdd = async (name: string) =>  {
      if (visible === "Board") {
        await trelloAPI.createBoard(name).then(() => {
          Vibration.vibrate([0, 60, 0, 0]);
        });
        setVisible(null)
        getWorkspaces();
      } else if (visible === "Workspace") {
        await trelloAPI.createWorkspace(name)
        setVisible(null)
        getWorkspaces();
      }
    }

    const handleEdit = async (name: string) => {
      if (edit) {
        await trelloAPI.renameWorkspace(selectedWorkspace, name)
        setEdit(null);
        getWorkspaces();
      }
    }

    const handleDeleteBoard = async (id: string) => {
      await trelloAPI.deleteBoard(id).then(() => {
        Vibration.vibrate([0, 60, 0, 0]);
      });
      getWorkspaces();
    }

    useEffect(() => {
      if (searchQuery) {
        const filteredBoards = boards.filter(board => board.name.toLowerCase().includes(searchQuery.toLowerCase()));
        setBoards(filteredBoards);
      } else {
        getWorkspaces();
      }
    }, [searchQuery]);

  const handleTokenReceived = async (token: string) => {
    trelloAPI.setToken(token);
    setStart(false);
    getWorkspaces();
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  useEffect(() => {
    if (token) {
      handleTokenReceived(token);
    }

    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      console.log("Stored token:", storedToken);
      if (storedToken) {
        setToken(storedToken);
        setStart(false);
        trelloAPI.setToken(storedToken);
        getWorkspaces();
      }
    }
    checkToken();
  }, [token]);

  return (
      <View style={styles.container}>
        {!start ? (
        <PaperProvider>
        <View>
          <Searchbar
            placeholder="Search..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onIconPress={() => {}}
            style={{ marginTop: 20, marginHorizontal: 10, backgroundColor: '#fff' }}
          />
        </View>

        {workspaces.length > 0 && (
          <View style={styles.workspacesContainer}>
            <Picker
              selectedValue={selectedWorkspace || workspaces[0].id}
              onValueChange={(itemValue) => setSelectedWorkspace(itemValue)}
            >
              {workspaces.map(workspace => (
                <Picker.Item key={workspace.id} label={workspace.displayName} value={workspace.id} />
              ))}
            </Picker>
          </View>
        )}

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getWorkspaces} colors={['#0079BF', '#D29034', '#519839', '#B04632', '#89609E']} />
          }
        >
          <View style={styles.boardsContainer}>
            <Text style={styles.title}>Your board{boards.length > 1 ? 's' : ''}</Text>
            {boards.map(board => {
              if (selectedWorkspace && board.idOrganization !== selectedWorkspace) return null;
              return (
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
              )})}

            {((boards.length === 0 || boards.find(board => board.idOrganization === selectedWorkspace) === undefined) && !refreshing) &&
              <Text style={{ fontSize: 20, color: 'gray', marginTop: 20, textAlign: 'center' }}>
              {searchQuery ? 'No boards found for this search :(' : 'You don\'t have any boards yet\nStart by creating one!'}
              </Text>
            }
          </View>
        </ScrollView>

        <Portal>
          <Modal visible={!!visible} onDismiss={() => setVisible(null)} contentContainerStyle={containerStyle}>
            <TextInput mode="outlined" placeholder={`${visible} name...`} autoFocus onSubmitEditing={(e) => handleAdd(e.nativeEvent.text)} />
          </Modal>

          <Modal visible={!!edit} onDismiss={() => setEdit(null)} contentContainerStyle={containerStyle}>
            <TextInput mode="outlined" autoFocus onSubmitEditing={(e) => handleEdit(e.nativeEvent.text)} value={edit} onChangeText={setEdit} />
          </Modal>
        </Portal>

        <View style={styles.tooltip}>
          <AddButton options={[
            { icon: 'trash-can', label: 'Delete Workspace', onPress: () => {
              Alert.alert(
                'Delete Workspace',
                'Are you sure you want to delete this workspace?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: () => {
                      trelloAPI.deleteWorkspace(selectedWorkspace).then(() => {
                        Vibration.vibrate([0, 60, 0, 0]);
                        getWorkspaces();
                      })
                    }
                  },
                ],
              );
            } },
            { icon: 'pen', label: 'Edit Workspace', onPress: () => setEdit(workspaces.find(workspace => workspace.id === selectedWorkspace)?.displayName) },
            { icon: "table", label: 'Create workspace', onPress: () => setVisible("Workspace") },
            { icon: "bulletin-board", label: 'Create board', onPress: () => setVisible("Board") },
          ]} />
        </View>
      </PaperProvider>
        ) : (
          <Login onTokenReceived={handleTokenReceived} />
      )}
      </View>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screens: {
    Home: {
      screen: Base,
      options: {
        headerShown: false,
      },
    },
    Board: {
      screen: BoardPage,
      options: ({ route }: any) => ({
        title: route?.params?.name,
        animation: 'ios_from_right',
      }),
    },
    Card: {
      screen: Card,
      options: ({ route }: any) => ({
        title: `${route?.params?.name} | ${route?.params?.parentName}`,
        animation: 'ios_from_right',
      }),
    },
  },
  id: undefined
});

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator id={undefined}>
        <RootStack.Screen
          name="Home"
          component={Base}
          options={{
            headerTitleAlign: 'center',
            headerTitle: 'Trello',
            headerStyle: { backgroundColor: '#0079BF' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 25, color: '#fff' },
          }}
        />
        <RootStack.Screen
          name="Board"
          component={BoardPage}
          options={({ route }: any) => ({
            title: route?.params?.name,
            animation: 'ios_from_right',
            headerTitleAlign: 'center',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 25, color: '#fff' },
            headerStyle: { backgroundColor: '#0079BF' },
            headerTintColor: '#fff',
          })}
        />
        <RootStack.Screen
          name="Card"
          component={Card}
          options={({ route }: any) => ({
            title: `${route?.params?.name} | ${route?.params?.parentName}`,
            animation: 'ios_from_right',
            headerTitleAlign: 'center',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 25, color: '#fff' },
            headerStyle: { backgroundColor: '#0079BF' },
            headerTintColor: '#fff',
          })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },

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

  workspacesContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  fab: {
    position: 'absolute',
    top: WINDOW_HEIGHT - 80,
    right: 15,
    zIndex: 1,
  },
});
