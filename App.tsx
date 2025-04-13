import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Vibration, ScrollView, RefreshControl, Alert, Dimensions } from 'react-native';
import { PaperProvider, Searchbar, Menu, Divider, Text } from 'react-native-paper';
import Login from './Login';
import TrelloAPI from "./trello_module";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AddButton, Board, Logout, MenuPopup, Snackbar } from './components';
import Card from './Card';
import BoardPage from './Board';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getWorkspaces from './lib/getWorkspaces';
import * as SplashScreen from 'expo-splash-screen';

const apiKey = process.env.REACT_APP_TRELLO_API_KEY;
export const trelloAPI = new TrelloAPI(apiKey);

type Board = {
  id: string;
  name: string;
};

const TOKEN_STORAGE_KEY = "trello_token";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

const Base = () => {
  const [start, setStart] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation() as any;
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  const [boards, setBoards] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [visible, setVisible] = useState<"Board" | "Workspace" | null>(null);
  const [boardCreationType, setBoardCreationType] = useState<string>("none");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(true);
  const [edit, setEdit] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState<{ id, name} | null>(null);
  const [alert, setAlert] = useState<{ visible: boolean, message: string }>({ visible: false, message: '' });

  const handleCallWorkspaces = async (isLast?: boolean) => {
    setRefreshing(true);
    await getWorkspaces(trelloAPI, setWorkspaces, selectedWorkspace, setSelectedWorkspace, setBoards, isLast);
    setRefreshing(false);
  }

  const handleAdd = async (name: string) =>  {
    if (visible === "Board") {
      await trelloAPI.createBoard(name, selectedWorkspace || "", selectedTemplateId)
      getWorkspaces(trelloAPI, setWorkspaces, selectedWorkspace, setSelectedWorkspace, setBoards);
      setBoardCreationType("none");
      setAlert({ visible: true, message: `Board "${name}" created` });
      setVisible(null);
    } else if (visible === "Workspace") {
      await trelloAPI.createWorkspace(name)
      setAlert({ visible: true, message: `Workspace "${name}" created` });
      setVisible(null)
      handleCallWorkspaces(true);
    }
  }

  const handleEdit = async (name: string) => {
    if (edit) {
      if  (menuVisible) {
        await trelloAPI.renameBoard(menuVisible.id, name);
      } else {
        await trelloAPI.renameWorkspace(selectedWorkspace, name);
      }
      setAlert({ visible: true, message: `${menuVisible ? "Board" : "Workspace"} ${name} updated` });
      setEdit(null);
      setVisible(null);
      setSearchQuery('');
      setMenuVisible(null);
      handleCallWorkspaces(true);
    }
  }

  const handleDeleteBoard = async (id: string) => {
    setMenuVisible(null);
    Alert.alert(
      `Delete board "${boards.find(board => board.id === id)?.name}"`,
      'Are you sure you want to delete this board?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await trelloAPI.deleteBoard(id).then(() => {
              setAlert({ visible: true, message: `Board "${boards.find(board => board.id === id)?.name}" deleted` });
              setSearchQuery('');
              Vibration.vibrate([0, 60, 0, 0]);
            });
            handleCallWorkspaces(true);
          }
        },
      ],
    );
  }

  useEffect(() => {
    if (searchQuery) {
      const filteredBoards = boards.filter(board => board.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setBoards(filteredBoards);
    } else {
      handleCallWorkspaces(true);
    }
  }, [searchQuery]);

  const handleTokenReceived = async (token: string) => {
    trelloAPI.setToken(token);
    setStart(false);
    handleCallWorkspaces(true);
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  // Check if the token is already stored in AsyncStorage, if so, set it to the state and fetch workspaces, else show the login screen
  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
      setStart(false);
      trelloAPI.setToken(storedToken);
      handleCallWorkspaces(true);
    }
  }
  useEffect(() => {
    if (token) {
      handleTokenReceived(token);
    }

    checkToken();
  }, [token]);

  useEffect(() => {
    async function prepareApp() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // if token fetch workspaces else show login screen
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedToken) {
          trelloAPI.setToken(storedToken);
          setStart(false);
          await handleCallWorkspaces(true);
        } else {
          setStart(true);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    }
    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  return (
      <View style={styles.container} onLayout={onLayoutRootView}>
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
            <RefreshControl refreshing={refreshing} onRefresh={handleCallWorkspaces} colors={['#0079BF', '#D29034', '#519839', '#B04632', '#89609E']} />
          }
        >
          {/* Display boards */}
          <View style={styles.boardsContainer}>
            <Text style={styles.title}>Your board{boards.length > 0 && boards.find(board => board.idOrganization === selectedWorkspace) ? 's' : ''}</Text>
            {boards.map(board => {
              if (selectedWorkspace && board.idOrganization !== selectedWorkspace) return null;
              return (
                <View key={board.id}>
                  <Menu
                    key={board.id}
                    visible={menuVisible?.id === board.id}
                    onDismiss={() => setMenuVisible(null)}
                    style={{
                      marginLeft: Dimensions.get('window').width / 2 - 80,
                    }}
                    theme={{ colors: { elevation: { level2: '#69c8ff' } } }}
                    anchor={
                      <Board
                        board={board}
                        onPress={(id, name) => navigation.navigate('Board', { id, name })}
                          onLongPress={(id, name) => setMenuVisible({ id, name })}
                      />
                    }
                  >
                    <Menu.Item onPress={() => {
                      setEdit(board.name);
                    }} title="Edit board" leadingIcon="pencil" />
                    <Menu.Item onPress={() => {
                      navigation.navigate('Board', { id: board.id, name: board.name });
                      setMenuVisible(null);
                    }} title="View cards" leadingIcon="card-text" />
                    <Divider />
                    <Menu.Item onPress={() => handleDeleteBoard(board.id)} title="Delete board" leadingIcon="trash-can" />
                  </Menu>
                </View>
              )})}

            {((boards.length === 0 || boards.find(board => board.idOrganization === selectedWorkspace) === undefined) && !refreshing) &&
              <Text style={{ fontSize: 20, color: 'gray', marginTop: 20, textAlign: 'center' }}>
              {searchQuery ? 'No boards found for this search :(' : 'You don\'t have any boards yet\nStart by creating one!'}
              </Text>
            }
          </View>
        </ScrollView>

        <MenuPopup
          visible={visible}
          setVisible={setVisible}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          edit={edit}
          setEdit={setEdit}
          boards={boards}
          selectedTemplateId={selectedTemplateId}
          setSelectedTemplateId={setSelectedTemplateId}
          boardCreationType={boardCreationType}
          setBoardCreationType={setBoardCreationType}
        />

        <View style={styles.tooltip}>
          <AddButton
            label='Manage boards/workspaces'
            options={[
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
                      onPress: async () => {
                        await trelloAPI.deleteWorkspace(selectedWorkspace).then(() => {
                          setAlert({ visible: true, message: `Workspace successfully deleted` });
                          Vibration.vibrate([0, 60, 0, 0]);
                          setSelectedWorkspace(workspaces[0].id);
                        })
                      }
                    },
                  ],
                );
              }},
            { icon: 'pen', label: 'Edit Workspace', onPress: () => setEdit(workspaces.find(workspace => workspace.id === selectedWorkspace)?.displayName) },
            { icon: "table", label: 'Create workspace', onPress: () => setVisible("Workspace") },
            { icon: "bulletin-board", label: 'Create board', onPress: () => setVisible("Board") },
          ]} />
        </View>
      </PaperProvider>
        ) : (
          <Login onTokenReceived={handleTokenReceived} />
      )}

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
      <StatusBar backgroundColor="#0079BF" style="light" />
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
            headerRight: () => (
              <Logout />
            ),
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
            headerRight: () => (
              <Logout />
            ),
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
            headerRight: () => (
              <Logout />
            ),
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
