import { View, Alert } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { trelloAPI } from '../../App';
import { useEffect, useState } from 'react';

const Logout = () => {
  const navigation = useNavigation() as any;
  const [isToken, setIsToken] = useState<string | null>(null);

  const checkToken = async () => {
    const storedToken = await AsyncStorage.getItem("trello_token");
    if (storedToken) {
      setIsToken(storedToken);
    }
  }

  useEffect(() => {
    checkToken();
    const unsubscribe = navigation.addListener('focus', () => {
      checkToken();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    checkToken();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Déconnexion",
          onPress: async () => {
            await trelloAPI.setToken("");
            await AsyncStorage.removeItem("trello_token");
            await navigation.reset({
              index: 0,
              routes: [{ name: "Home" }]
            });

            await navigation.navigate("Home");

          }
        }
      ],
      { cancelable: false }
    )
  };

  if (!isToken) return null;

  return (
    <View>
      <Button mode="contained" onPress={() => { handleLogout() }} style={{ backgroundColor: "#0079BF" }}>
        <Icon source="logout" color="#fff" size={25} />
      </Button>
    </View>
  );
};

export default Logout;