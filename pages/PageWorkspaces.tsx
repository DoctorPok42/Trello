import { Header } from "@/components/trello/Header";
import { RootState } from "@/store";
import { setOrganizationData, setOrganizationName } from "@/store/slices/organizationSlice";
import { createOrganization, deleteOrganization, getOrganization, updateOrganization } from "@/utils/trello/organizations";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Alert, View, Dimensions, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";
import { ManageLabels } from "./ManageLabels";
import { activeTrigger } from "@/store/slices/triggerSlice";
import { MaterialSymbolsAddRounded } from "@/components/icons/MaterialSymbolsAddRounded";
import { setBottomBarColor } from "@/store/slices/colorsSlice";

export const PageWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const organization = useSelector((state: RootState) => state.organization);
  const trigger = useSelector((state: RootState) => state.activeTrigger);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const dynamicBackgroundColor = useSelector((state: RootState) => state.color.activeColor);
  
  useEffect(() => {
    dispatch(setBottomBarColor("black"))
  }, [dynamicBackgroundColor])


  const fetchOrganizations = async () => {
    const responseData = await getOrganization();
    if (responseData) setWorkspaces(responseData);
  };

  const handleSelectOrganization = (
    workspaceId: string,
    workspaceName: string | undefined
  ) => {
    dispatch(setOrganizationData({ ...organization, id: workspaceId }));
    if (workspaceName)
      dispatch(setOrganizationName({ ...organization, name: workspaceName }));
    navigation.navigate("PageBoards" as never);
  };

  const handleCreateOrganization = async () => {
    Alert.prompt(
      "New workspace",
      "Please enter the workspace name.",
      async (displayName) => {
        let response = await createOrganization(displayName);
        if (response) {
          await fetchOrganizations();
        } else Toast.error("Error during Workspace creation.");
      }
    );
  };

  const handleRenameOrganization = async (organizationID: string) => {
    Alert.prompt("Rename card", "Type card's new name.", async (name) => {
      const response = await updateOrganization(organizationID, name);
      if (response) {
        dispatch(activeTrigger(true));
      } else Toast.error("Error during card rename.");
    });
  };

  const handleDeleteOrganization = async (organizationID: string) => {
    const response = await deleteOrganization(organizationID);
    if (response) {
      dispatch(activeTrigger(true));
    } else Toast.error("Error during deleting organization.");
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    fetchOrganizations();
    dispatch(activeTrigger(false));
  }, [trigger]);

  return (
    <>
      <Header
        title="Workspaces"
        svg={<MaterialSymbolsAddRounded />}
        action={handleCreateOrganization}
      />
      <View style={{ flex: 1, paddingBottom: 100  }}>
        <ManageLabels
          renameAction={handleRenameOrganization}
          deleteAction={handleDeleteOrganization}
          redirectAction={handleSelectOrganization}
          givenItem="Workspaces"
          data={workspaces}
        />

      </View>
    </>
  );
};