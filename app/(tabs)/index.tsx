import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PageHome } from '@/pages/PageHome';
import { PageBoards } from '@/pages/PageBoards';
import { PageWorkpaces } from '@/pages/PageWorspaces';
import { Provider } from 'react-redux';
import store from '@/store';
import { PageLists } from '@/pages/PageLists';
import ToastManager from 'toastify-react-native/components/ToastManager';

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
    <ToastManager />
    <SafeAreaView style={styles.container}>
       <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="PageHome" component={PageHome} /> 
       <Stack.Screen name="PageWorkspaces" component={PageWorkpaces} /> 
       <Stack.Screen name="PageBoards" component={PageBoards} /> 
       <Stack.Screen name="PageLists" component={PageLists} /> 
       </Stack.Navigator>
    </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#015A8E"
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default App;