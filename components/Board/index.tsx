import { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Pressable } from 'react-native';

interface BoardProps {
  board: any;
  onPress: (id: string, name: string) => void;
  onLongPress: (id: string, name: string) => void;
}

const Board = ({
  board,
  onPress,
  onLongPress,
}: BoardProps) => {
  const [isLongPress, setIsLongPress] = useState<boolean>(false);

  const handlePress = () => !isLongPress && onPress(board.id, board.name);

  const handleLongPress = () => {
    setIsLongPress(true);
    onLongPress(board.id, board.name);
  }

  return (
    <Pressable
      onLongPress={handleLongPress}
      onPressOut={() => setIsLongPress(false)}
    >
      <View
        style={[styles.Board_container,{ backgroundColor: board.prefs?.backgroundColor ?? '#0079BF', transform: [{ scale: isLongPress ? 1.03 : 1 }] }]}
        onTouchEnd={handlePress}
      >
        <View style={styles.title}>
          <Text style={styles.text}>{board.name}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const WINDOW_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  Board_container: {
    width: WINDOW_WIDTH - 20,
    height: 90,
    borderRadius: 8,
    boxShadow: '0 3px 3px rgba(0, 0, 0, 0.1)',
  },

  title: {
    margin: 15,
    flex: 1,
    gap: 5,
  },

  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  }
});

export default Board;