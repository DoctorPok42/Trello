import { updateCard } from '@/utils/trello/cards';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';
import { Toast } from 'toastify-react-native';

interface CardPopupProps {
    onClose: () => void;
    onSave: (name: string, description: string) => void;
    visible: boolean;
    cardId: string;
}

const CardPopup: React.FC<CardPopupProps> = ({ onClose, visible, cardId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        handleUpdateCard();
        onClose();
    };

    const handleUpdateCard = async() => {
        const response = await updateCard(cardId, name, description);
        if (response) Toast.success("Ouraa! Card updated.")
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.container}>
                <View style={styles.popup}>
                    <Text style={styles.title}>Edit Card</Text>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <Text style={styles.label}>Description:</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                    <View style={styles.actions}>
                        <Button title="Cancel" onPress={onClose} />
                        <Button title="Save" onPress={handleSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default CardPopup;