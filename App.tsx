import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Login from './Login';
import { Button } from './components';
import Home from './Home';
import { TrelloAPI } from "./trello_module";
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Board from './Board';
import Card from './Card';

const apiKey = process.env.REACT_APP_TRELLO_API_KEY;
export const trelloAPI = new TrelloAPI(apiKey);

type Board = {
  id: string;
  name: string;
};

const Base = () => {
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [onLogin, setOnLogin] = useState<boolean>(true);

  useEffect(() => {
    if (apiToken)
      trelloAPI.setToken(apiToken);
  }, [apiToken]);

  return (
      <View style={styles.container}>
        {apiToken ? (
          <Home />
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20 }}>
            <Text style={{ fontSize: 20 }}>Connectez-vous pour voir vos boards</Text>
             <Button title='Login' onPress={() => setOnLogin(true)} color='#2B2B2B' />
          </View>
        )}

        {onLogin && <Login onTokenReceived={(token) => {
          setApiToken(token);
          setOnLogin(false);
        }} />}
      </View>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screens: {
    Home: {
      screen: Base,
      options: {
        headerShown: false,
      },
    },
    Board: {
      screen: Board,
      options: ({ route }: any) => ({
        title: route?.params?.name,
        animation: 'ios_from_right',
      }),
    },
    Card: {
      screen: Card,
      options: ({ route }: any) => ({
        title: `${route?.params?.name} | ${route?.params?.parentName}`,
        animation: 'ios_from_right',
      }),
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
