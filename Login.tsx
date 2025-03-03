import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

type LoginProps = {
  onTokenReceived: (token: string) => void;
};

const Login: React.FC<LoginProps> = ({ onTokenReceived }) => {
  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    if (url.includes('token=')) {
      const regex = /[&#?]token=([^&]+)/;
      const match = url.match(regex);
      console.log('match', match);
      if (match?.[1]) {
        onTokenReceived(match[1]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://trello.com/1/authorize?expiration=1day&scope=read,write&response_type=token&key=2050d2eacd71d1a0124f5257cc7ead9d' }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Login;
