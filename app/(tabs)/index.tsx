import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PageHome } from '@/pages/PageHome';
import { PageBoards } from '@/pages/PageBoards';
import { PageWorkpaces } from '@/pages/PageWorspaces';
import { Provider } from 'react-redux';
import store from '@/store';

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
    <SafeAreaView style={styles.container}>
       <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="PageHome" component={PageHome} /> 
       <Stack.Screen name="PageBoards" component={PageBoards} /> 
       <Stack.Screen name="PageWorkspaces" component={PageWorkpaces} /> 
       </Stack.Navigator>
    </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831"
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default App;