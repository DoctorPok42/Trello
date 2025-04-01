import { IonCreate } from "@/components/icons/IonCreate";
import { Header } from "@/components/trello/Header";
import { ListCard } from "@/components/trello/ListCard";
import { RootState } from "@/store";
import { setOrganizationData } from "@/store/slices/organizationSlice";
import { createOrganization, getOrganization } from "@/utils/trello/organizations";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

export const PageWorkpaces = () => {
  const [workspaces, setWorkspaces] = useState<any[]>();
  const organization = useSelector(
    (state: RootState) => state.organization.data
  );
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fetchOrganizations = async () => {
    const responseData = await getOrganization();
    if (responseData) setWorkspaces(responseData);
  };

  const handleSelectOrganization = (workspaceId: string) => {
    const dataToSet = { ...organization, id: workspaceId };
    dispatch(setOrganizationData(dataToSet));
    navigation.navigate("PageBoards" as never);
  };

  const handleCreateOrganization = async () => {
    Alert.prompt(
      "New workspace",
      "Type workspace's name.",
      async (displayName) => {
        let response = await createOrganization(displayName);
        if (displayName)
          response
            ? Toast.success("Workspace created")
            : Toast.error("Error during Workspace creation.");
      }
    );
  };
  
  useEffect(() => {
    fetchOrganizations();
  }, [handleCreateOrganization]);

  return (
    <>
      <Header title="Workspace" svg={<IonCreate/>} action={handleCreateOrganization} />
      <View style={styles.container}>
        <FlatList
          data={workspaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListCard
              customHeight={75}
              title={item.displayName}
              onPress={() => handleSelectOrganization(item.id)}
            />
          )}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {},
});
