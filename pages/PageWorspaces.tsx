import { IonCreate } from "@/components/icons/IonCreate";
import { MaterialSymbolsArrowCircleRightOutline } from "@/components/icons/MaterialSymbolsArrowCircleRightOutline";
import { Header } from "@/components/trello/Header";
import { ListCard } from "@/components/trello/ListCard";
import { RootState } from "@/store";
import {
  setOrganizationData,
  setOrganizationName,
} from "@/store/slices/organizationSlice";
import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  updateOrganization,
} from "@/utils/trello/organizations";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

export const PageWorkpaces = () => {
  const [workspaces, setWorkspaces] = useState<any[]>();
  const organization = useSelector((state: RootState) => state.organization);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fetchOrganizations = async () => {
    const responseData = await getOrganization();
    if (responseData) setWorkspaces(responseData);
  };

  const handleSelectOrganization = (
    workspaceId: string,
    workspaceName: string
  ) => {
    dispatch(setOrganizationData({ ...organization, id: workspaceId }));
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
          Toast.success("Workspace created");
        } else Toast.error("Error during Workspace creation.");
      }
    );
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const ButtonAction = ({
    onPress,
    label,
    backgroundColor,
  }: {
    onPress: () => void;
    label: string;
    backgroundColor: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionButton, { backgroundColor }]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );

  const handleRenameOrganization = async (organizationID: string) => {
    Alert.prompt("Rename card", "Type card's new name.", async (name) => {
      const response = await updateOrganization(organizationID, name);
      if (response) {
        Toast.success("Organization renamed.");
      } else Toast.error("Error during card rename.");
    });
  };

  const handleDeleteOrganization = async (organizationID: string) => {
    const response = await deleteOrganization(organizationID);
    if (response) {
      Toast.success("Organization deleted.");
    } else Toast.error("Error during deleting organization.");
  };

  useEffect(() => {
    fetchOrganizations();
  }, [handleRenameOrganization, handleDeleteOrganization]);

  return (
    <>
      <Header title="Workspaces" svg={<IonCreate />} action={handleCreateOrganization}/>
      <View style={{ flex: 1, paddingBottom: 100 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {workspaces && workspaces.length > 0 ? (
            <FlatList
              data={workspaces}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ marginVertical: 5, paddingHorizontal: 10 }}>
                  <Swipeable
                    key={item.id}
                    renderLeftActions={() => (
                      <>
                        <ButtonAction
                          onPress={() => handleRenameOrganization(item.id)}
                          label="Rename"
                          backgroundColor="orange"
                        />
                      </>
                    )}
                    renderRightActions={() => (
                      <>
                        <ButtonAction
                          onPress={() => handleDeleteOrganization(item.id)}
                          label="Delete"
                          backgroundColor="rgb(255, 53, 53)"
                        />
                      </>
                    )}
                  >
                    <ListCard
                      svg={<MaterialSymbolsArrowCircleRightOutline />}
                      title={item.displayName}
                      hasData={false}
                      onPress={() =>
                        handleSelectOrganization(item.id, item.displayName)
                      }
                    />
                  </Swipeable>
                </View>
              )}
            />
          ) : (
            <Text>No Workspace yet</Text>
          )}
        </GestureHandlerRootView>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.3,
    height: Dimensions.get("screen").height * 0.09,
    borderRadius: 100,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
