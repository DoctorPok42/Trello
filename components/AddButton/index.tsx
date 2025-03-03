import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Tooltip } from 'react-native-paper';

interface AddButtonProps {
  onPress: () => void;
}

const AddButton = ({
  onPress,
}: AddButtonProps) => {
  return (
    <View >
      <Tooltip title="Add board" style={styles.tooltip}>
        <IconButton icon="plus" selected size={45} onPress={onPress} iconColor="#fff" />
      </Tooltip>
    </View>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  tooltip: {
    backgroundColor: '#6b8bfdb2',
    borderRadius: 12,
  },
});