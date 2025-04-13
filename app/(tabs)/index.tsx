import React, { useEffect } from 'react';
import {StyleSheet, SafeAreaView, ImageBackground} from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PageHome } from '@/pages/PageHome';
import { PageBoards } from '@/pages/PageBoards';
import { PageWorkspaces } from '@/pages/PageWorkspaces';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '@/store';
import { PageLists } from '@/pages/PageLists';
import ToastManager from 'toastify-react-native/components/ToastManager';
import { setBottomBarColor } from '@/store/slices/colorsSlice';

const App = () => {
  const Stack = createNativeStackNavigator();
  const dispatch = useDispatch();
  const dynamicBackgroundColor = useSelector((state: RootState) => state.color.activeColor);
     
  useEffect(() => {
     dispatch(setBottomBarColor("black"))
  }, [dynamicBackgroundColor])
   
  return (
    <Provider store={store}>
    <ToastManager />
    <SafeAreaView style={styles.container}>
       <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="PageHome" component={PageHome} /> 
       <Stack.Screen name="PageWorkspaces" component={PageWorkspaces} /> 
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
    backgroundColor: 'rgb(0, 0, 0)'
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default App;