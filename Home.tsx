import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, RefreshControl, Alert, Vibration } from 'react-native';
import { Modal, Portal, Text, PaperProvider, TextInput, Searchbar } from 'react-native-paper';
import { AddButton, Board } from './components';
import { useNavigation } from '@react-navigation/native';
import { trelloAPI } from './App';
import { Picker } from '@react-native-picker/picker';
import getWorkspaces from './lib/getWorkspaces';

const containerStyle = {
  backgroundColor: 'white',
  padding: 10,
  margin: 20,
  borderRadius: 10,
  width: Dimensions.get('window').width - 40,
};

const Home = () => {
  const navigation = useNavigation() as any;

  const [boards, setBoards] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [visible, setVisible] = useState<"Board" | "Workspace" | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(true);
  const [edit, setEdit] = useState<string | null>(null);

  const handleCallWorkspaces = async () => {
    setRefreshing(true);
    await getWorkspaces(trelloAPI, setWorkspaces, selectedWorkspace, setSelectedWorkspace, setBoards);
    setRefreshing(false);
  }

  const handleAdd = async (name: string) =>  {
    if (visible === "Board") {
      await trelloAPI.createBoard(
        name,
        selectedWorkspace || workspaces[0].id,
        boards.find(board => board.name === name)?.id || undefined
      ).then(() => {
        Vibration.vibrate([0, 60, 0, 0]);
      });
      setVisible(null)
      handleCallWorkspaces();
    } else if (visible === "Workspace") {
      await trelloAPI.createWorkspace(name)
      setVisible(null)
      handleCallWorkspaces();
    }
  }

  const handleEdit = async (name: string) => {
    if (edit) {
      await trelloAPI.renameWorkspace(selectedWorkspace, name)
      setEdit(null);
      handleCallWorkspaces();
    }
  }

  const handleDeleteBoard = async (id: string) => {
    await trelloAPI.deleteBoard(id).then(() => {
      Vibration.vibrate([0, 60, 0, 0]);
    });
    handleCallWorkspaces();
  }

  useEffect(() => {
    if (searchQuery) {
      const filteredBoards = boards.filter(board => board.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setBoards(filteredBoards);
    } else {
      handleCallWorkspaces();
    }
  }, [searchQuery]);

   useEffect(() => {
    handleCallWorkspaces();
   }, []);

  return (
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
            <TextInput mode="outlined" placeholder={`${visible} name...`} autoFocus onSubmitEditing={(e) => handleAdd(e.nativeEvent.text)} theme={{ colors: { primary: '#0079BF' }}} />
          </Modal>

          <Modal visible={!!edit} onDismiss={() => setEdit(null)} contentContainerStyle={containerStyle}>
            <TextInput mode="outlined" autoFocus onSubmitEditing={(e) => handleEdit(e.nativeEvent.text)} value={edit} onChangeText={setEdit} theme={{ colors: { primary: '#0079BF' }}} />
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
                        handleCallWorkspaces();
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

export default Home;