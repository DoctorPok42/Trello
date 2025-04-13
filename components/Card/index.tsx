import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Status from './status';

interface CardProps {
  name: string;
  dueDate: string;
  dueComplete: boolean;
  onCardPress: () => void;
  onLongPress: (name: string) => void;
}

const Card = ({
  name,
  dueDate,
  dueComplete,
  onCardPress,
  onLongPress,
}: CardProps) => {
  const [isLongPress, setIsLongPress] = useState<boolean>(false);

  const handlePress = () => !isLongPress && onCardPress();

  const handleLongPress = () => {
    setIsLongPress(true);
    onLongPress(name);
  }

  return (
    <View
      style={[styles.card, dueComplete ? styles.completedCard : styles.pendingCard]}
      onTouchEnd={handlePress}
    >
      <Pressable
        onLongPress={handleLongPress}
        onPressOut={() => setIsLongPress(false)}
      >
        <Text style={styles.cardTitle}>{name}</Text>

        {dueDate ? (
          <View style={styles.dueContainer}>
            <FontAwesome name="calendar" size={16} color={dueComplete ? 'green' : 'red'} />
            <Text style={[styles.dueText, dueComplete && styles.dueCompleteText]}>
              {new Date(dueDate).toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <Text style={styles.noCardsText}>No due date</Text>
        )}

        <Status dueComplete={dueComplete} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
  },

  card: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  completedCard: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 5,
    borderLeftColor: 'green',
  },

  pendingCard: {
    backgroundColor: '#f8d7da',
    borderLeftWidth: 5,
    borderLeftColor: 'red',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  dueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  dueText: {
    marginLeft: 5,
    fontSize: 14,
    color: 'red',
  },

  dueCompleteText: {
    color: 'green',
  },

  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },

  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
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

  noCardsText: {
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default Card;