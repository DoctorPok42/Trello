import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface AddButtonProps {
  onPress: () => void;
  style?: any;
}

const AddButton = ({
  onPress,
  style,
}: AddButtonProps) => {
  return (
    <TouchableOpacity style={[styles.floatingButton, style]} onPress={onPress}>
      <FontAwesome name="plus" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 5,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});