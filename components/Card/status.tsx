import { View, StyleSheet, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface StatusProps {
  dueComplete: boolean;
  onPress?: () => void;
}

const Status = ({
  dueComplete,
  onPress,
}: StatusProps) => {
  return (
    <Pressable onPress={onPress}>
    {dueComplete ? (
        <View style={styles.completedBadge}>
          <FontAwesome name="check-circle" size={16} color="white" />
          <Text style={styles.completedText}>Terminée</Text>
        </View>
    ) : (
        <View style={styles.pendingBadge}>
          <FontAwesome name="clock-o" size={16} color="white" />
          <Text style={styles.pendingText}>À faire</Text>
        </View>
    )
    }
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 5,
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
});

export default Status;