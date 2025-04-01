import { IonCreate } from "@/components/icons/IonCreate";
import { MaterialSymbolsArrowCircleRightOutline } from "@/components/icons/MaterialSymbolsArrowCircleRightOutline";
import { Header } from "@/components/trello/Header";
import { ListCard } from "@/components/trello/ListCard";
import { RootState } from "@/store";
import { setOrganizationData } from "@/store/slices/organizationSlice";
import { createOrganization, getOrganization } from "@/utils/trello/organizations";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, FlatList, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

export const PageWorkpaces = () => {
  const [workspaces, setWorkspaces] = useState<any[]>();
  const organization = useSelector((state: RootState) => state.organization.data);
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
    Alert.prompt( "New workspace", "Please enter the workspace name.",
      async (displayName) => {
        let response = await createOrganization(displayName);
        if (response) {
          await fetchOrganizations();
          Toast.success("Workspace created");
        } else Toast.error("Error during Workspace creation.");
      }
    );
  };

  useEffect(() => {
    fetchOrganizations()
  }, []);

  return (
    <>
      <Header title="Workspaces" svg={<IonCreate />} action={handleCreateOrganization} />
        <FlatList
          data={workspaces}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListCard
              svg={<MaterialSymbolsArrowCircleRightOutline />}
              title={item.displayName}
              hasData={false}
              onPress={() => handleSelectOrganization(item.id)}
            />
          )}
        />
    </>
  );
};
const styles = StyleSheet.create({
  container: {},
});
