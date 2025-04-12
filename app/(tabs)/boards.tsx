import { PageBoards } from "@/pages/PageBoards";
import { Provider } from "react-redux";
import store from "@/store";
import { SafeAreaView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PageLists } from "@/pages/PageLists";

export default function Boards() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#015A8E" }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="/" component={() => <PageBoards displayAllBoards={true}/>} />
          <Stack.Screen name="PageLists" component={PageLists} />
        </Stack.Navigator>
      </SafeAreaView>
    </Provider>
  );
}
