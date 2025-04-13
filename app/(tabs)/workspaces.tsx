import { PageBoards } from "@/pages/PageBoards";
import { Provider } from "react-redux";
import store from "@/store";
import { SafeAreaView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PageLists } from "@/pages/PageLists";
import { PageWorkspaces } from "@/pages/PageWorkspaces";

export default function Boards() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="/" component={() => <PageWorkspaces />} />
          <Stack.Screen name="PageBoards" component={PageBoards} /> 
          <Stack.Screen name="PageLists" component={PageLists} /> 
        </Stack.Navigator>
      </SafeAreaView>
    </Provider>
  );
}
