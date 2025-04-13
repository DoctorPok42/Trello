import { activeTrigger } from "@/store/slices/triggerSlice";
import { Card } from "@/types/Card";
import { updateCard } from "@/utils/trello/cards";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Modal, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

interface CardPopupProps {
  onClose?: () => void;
  visible: boolean;
  card: Card;
}

export const CardPopup: React.FC<CardPopupProps> = ({
  onClose,
  visible,
  card,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editedCard, setEditedCard] = useState<Card>(card);
  const dispatch = useDispatch();

  const handleEditToggle = async () => {
    if (isEdit) {
      try {
        await updateCard(card.id, editedCard?.name, editedCard?.desc);
        dispatch(activeTrigger(true));
      } catch (error) {
        console.error("Failed to update card:", error);
      }
    }
    setIsEdit(!isEdit);
  };

  const handleInputChange = (field: keyof Card, value: string) => {
    setEditedCard({ ...editedCard, [field]: value });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.popup}>
          <ScrollView>
            <View style={styles.header}>
              {isEdit ? (
                <TextInput
                  style={styles.titleInput}
                  value={editedCard.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                />
              ) : (
                <Text style={styles.title}>{card?.name || "New Card"}</Text>
              )}
              <TouchableOpacity onPress={handleEditToggle}>
                <Text style={styles.editButton}>
                  {isEdit ? "Save" : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginBottom: 20}}>
            {card?.dateLastActivity && (
                  <>
                    <Text style={{fontSize: 12, fontStyle: "italic", color: "#DDD"}}>Last Activity: {new Date(card.dateLastActivity).toLocaleString("Fr-fr")}</Text>
                  </>
                )}
            </View>
            {isEdit ? (
              <>
                <Text style={styles.label}>Description:</Text>
                <TextInput
                  style={styles.valueInput}
                  value={editedCard?.desc}
                  onChangeText={(text) => handleInputChange("desc", text)}
                />
              </>
            ) : (
              <>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>
                  {card?.desc || "No description"}
                </Text>
                {card?.due && (
                  <>
                    <Text style={styles.label}>Due:</Text>
                    <Text style={styles.value}>{card?.due}</Text>
                  </>
                )}
                {card?.dueReminder && (
                  <>
                    <Text style={styles.label}>Due Reminder:</Text>
                    <Text style={styles.value}>{card?.dueReminder}</Text>
                  </>
                )}
                {card?.email && (
                  <>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{card?.email}</Text>
                  </>
                )}
                {card?.cardRole && (
                  <>
                    <Text style={styles.label}>Card Role:</Text>
                    <Text style={styles.value}>{card?.cardRole}</Text>
                  </>
                )}
                {card?.mirrorSourceId && (
                  <>
                    <Text style={styles.label}>Mirror Source ID:</Text>
                    <Text style={styles.value}>{card?.mirrorSourceId}</Text>
                  </>
                )}
              </>
            )}
          </ScrollView>
          <View style={styles.actions}>
            {isEdit ? (
              <Button title="Cancel" onPress={() => setIsEdit(false)} />
            ) : (
              <Button title="Close" onPress={onClose} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  popup: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#222831",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    height: "90%",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#DDDDDD",
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#DDDDDD",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
    color: "#DDDDDD",
  },
  value: {
    fontSize: 18,
    marginBottom: 5,
    color: "#DDDDDD",
    fontWeight: "200",
  },
  valueInput: {
    fontSize: 18,
    marginBottom: 5,
    color: "#DDDDDD",
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  editButton: {
    fontSize: 18,
    color: "#00ADB5",
    fontWeight: "500",
  },
});
