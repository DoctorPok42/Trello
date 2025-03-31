import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PageHome } from '@/pages/PageHome';
import { PageBoards } from '@/pages/PageBoards';

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView style={styles.container}>
       <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="PageHome" component={PageHome} /> 
       <Stack.Screen name="PageBoards" component={PageBoards} /> 
       </Stack.Navigator>
    </SafeAreaView>
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