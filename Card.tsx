import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Linking, Alert, RefreshControl, FlatList, Modal, Pressable } from 'react-native';
import { trelloAPI } from './App';
import { FontAwesome } from '@expo/vector-icons';
import Status from './components/Card/status';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

interface CardProps {
  route: any;
}

const Card = ({
  route
}: CardProps) => {
  const navigation = useNavigation() as any;
  const { id, name, lists, cardParent, boardMembers } = route.params;
  const [card, setCard] = useState<any>(cardParent);
  const [title, setTitle] = useState<string>(name);
  const [description, setDescription] = useState<string>(card.desc);
  const [assigneMembersModalVisible, setAssigneMembersModalVisible] = useState<boolean>(false);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState<boolean>(false);

  const fetchCard = async () => {
    try {
      const response = await trelloAPI.getCard(id);
      setCard(response);
    } catch (err: any) {
      console.log(err.message || 'Erreur inconnue');
    }
  };

  const handleListChange = async (itemValue: string) => {
    if (lists.find((list: any) => list.id === itemValue)) {
      await trelloAPI.updateCard(id, { idList: itemValue }).then(() => {
        fetchCard();
      });
    }
  }

  return (
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={fetchCard}
          colors={['#0079BF', '#D29034', '#519839', '#B04632', '#89609E']}
        />
      }
    >
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        theme={{ colors: { primary: '#0079BF' }}}
        onBlur={() => {
          trelloAPI.updateCard(id, { name: title }).then(() => {
            fetchCard();
          });
        }}
      />

      <View style={styles.labelsContainer}>
        {card.labels.map((label) => (
          <View key={label.id} style={[styles.label, { backgroundColor: label.color.split("_")[0] || 'red' }]}>
            <Text style={styles.labelText}>{label.name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <TextInput
        style={styles.descriptionInput}
        value={description}
        onChangeText={setDescription}
        theme={{ colors: { primary: '#0079BF' }}}
        onBlur={() => {
          trelloAPI.updateCard(id, { desc: description.trim() }).then(() => {
            fetchCard();
          });
        }}
        multiline
      />

      <Text style={styles.sectionTitle}>Liste</Text>
      <View style={styles.listContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={card.idList}
            onValueChange={(itemValue) => handleListChange(itemValue)}
            style={styles.picker}
          >
            {lists.map((list) => (
              <Picker.Item key={list.id} label={list.name} value={list.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.sectionTitle}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>Assigned members</Text>
        <View style={styles.icon}>
          <FontAwesome name="plus" size={16} color="#fff" style={{ marginTop: 1 }} onPress={() => setAssigneMembersModalVisible(true)} />
        </View>
      </View>

      <View style={styles.membersContainer}>
        {card.idMembers.map((memberId: string) => {
          const member = boardMembers.find((m: any) => m.id === memberId);
          return (
            <Pressable key={member.id}  onPress={() => {
              Alert.alert(
                  `Remove ${member.fullName}`,
                  'Are you sure you want to remove this member?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Remove',
                      onPress: () => {
                        trelloAPI.updateCard(id, { idMembers: card.idMembers.filter((id: string) => id !== member.id) }).then(() => {
                          fetchCard();
                        });
                      },
                    },
                  ],
                );
              }}>
                <View style={styles.memberBadge}>
                  <FontAwesome name="user" size={16} color="white" />
                  <Text style={styles.memberText}>{member.fullName}</Text>
                </View>
              </Pressable>
          );
        })}
        {card.idMembers.length === 0 && <Text style={styles.noDataText}>No members assigned</Text>}
      </View>

      <Modal visible={assigneMembersModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pick a member</Text>
            <FlatList
              data={boardMembers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => {
                    trelloAPI.updateCard(id, { idMembers: [...card.idMembers, item.id] }).then(() => {
                      fetchCard();
                      setAssigneMembersModalVisible(false);
                    });
                  }}
                >
                  <Text style={styles.userText}>{item.fullName}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setAssigneMembersModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {card.due && (
        <Pressable style={styles.dueContainer} onPress={() => setIsCalendarModalVisible(!isCalendarModalVisible)}>
          <FontAwesome name="calendar" size={16} color={card.dueComplete ? 'green' : 'red'} />
          <Text style={[styles.dueText, card.dueComplete && styles.dueCompleteText]}>
            {new Date(card.due).toLocaleDateString()}
          </Text>
        </Pressable>
      )}

      {isCalendarModalVisible && (
        <Calendar
          initialDate={card.due}
          minDate={new Date().toISOString().split('T')[0]}
          onDismiss={() => setIsCalendarModalVisible(false)}
          onDayPress={(day) => {
            trelloAPI.updateCard(id, { due: day.dateString }).then(() => {
              fetchCard();
              setIsCalendarModalVisible(false);
            });
          }}
        />
      )}

      <View style={styles.statusContainer}>
        <Status dueComplete={card.dueComplete} onPress={() => {
          trelloAPI.updateCard(id, { dueComplete: !card.dueComplete }).then(() => {
            fetchCard();
          });
        }}/>
      </View>

      <Text style={styles.sectionTitle}>Pièces jointes</Text>
      <Text>{card.attachments} fichiers attachés</Text>

      <TouchableOpacity style={[styles.linkButton, { backgroundColor: "#2b47d4" }]} onPress={() => {
        Linking.openURL(card.url);
      }}>
        <Text style={styles.linkText}>View on Trello</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.linkButton, { backgroundColor: "#e74c3c", marginBottom: 40 }]} onPress={() => {
        Alert.alert(
          `Delete card "${title}"`,
          'Are you sure you want to delete this card?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => {
                trelloAPI.deleteCard(id).then(() => navigation.goBack());
              },
            },
          ],
        );
      }}>
        <Text style={styles.linkText}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    elevation: 3,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 2,
    borderRadius: 5,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#f7F7F7',
    marginBottom: 15,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f7F7F7',
    padding: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  labelsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  labelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 50,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  dueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  dueText: {
    marginLeft: 5,
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
  },
  dueCompleteText: {
    color: 'green',
  },
  statusContainer: {
    marginVertical: 10,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  completedText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  pendingText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 5,
  },
  memberText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#888',
    fontStyle: 'italic',
  },
  linkButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  linkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  listText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#333',
  },
  picker: {
    height: 50,
    width: 300,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  userText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Card;