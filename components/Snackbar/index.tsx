import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

interface SnackbarProps {
  visible: boolean;
  message: string;
  actions?: any[];
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
}

const SnackBar = ({
  visible,
  message,
  actions = [],
  onAction,
  onDismiss,
  duration = 3000,
}: SnackbarProps) => {
  return (
    <View style={styles.Snackbar_container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={duration}
        action={
          actions.length > 0
            ? {
                label: actions[0].label,
                onPress: onAction || actions[0].onPress,
              }
            : undefined
        }
        style={{
          backgroundColor: '#333',
        }}
        theme={{ colors: {
          inversePrimary: '#039cf5',
        }, roundness: 8 }}
      >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  Snackbar_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99999999,
    padding: 16,
  }
});

export default SnackBar;