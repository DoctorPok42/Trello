import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Linking from "expo-linking";
import { Button, Text } from 'react-native-paper';

interface LoginProps {
  onTokenReceived: (token: string) => void;
};

const Login: React.FC<LoginProps> = ({
  onTokenReceived
}: LoginProps) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      try {
        const url = event.url;
        if (url.includes("token=")) {
          const params = new URLSearchParams(url.split("#")[1]);
          const token = params.get("token");
          if (token) {
            setToken(token);
            onTokenReceived(token);
          }
        }
      } catch (error) {
        throw new Error("Erreur lors du traitement du lien profond : " + error);
      }
    };

    const checkInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl)
        handleDeepLink({ url: initialUrl });
    };

    checkInitialUrl();

    Linking.addEventListener("url", handleDeepLink);
  }, []);

  const handleAuth = async () => {
    const authUrl = `https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=2050d2eacd71d1a0124f5257cc7ead9d&return_url=myapp://auth`;

    await Linking.openURL(authUrl);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge">Se connecter à Trello</Text>
      <Text variant="bodyLarge">Pour utiliser l'application, vous devez vous connecter à Trello.</Text>
      <Button mode="contained" onPress={handleAuth}>Se connecter à Trello</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
    gap: 20,
  },
});

export default Login;
