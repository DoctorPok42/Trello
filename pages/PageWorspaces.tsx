import { Cards } from "@/components/trello/card";
import { RootState } from "@/store";
import { setOrganizationData } from "@/store/slices/organizationSlice";
import { getOrganization } from "@/utils/trello/organizations";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from 'react-redux'

export const PageWorkpaces = () => {
    const [workspaces, setWorkspaces] = useState<any[]>();
    const organization = useSelector((state: RootState) => state.organization.data);
    const navigation = useNavigation();
    const dispatch = useDispatch()

  const fetchOrganizations = async () => {
    const responseData = await getOrganization();
    if (responseData) setWorkspaces(responseData);
  };

  const handleSelectOrganization = (workspaceId: string) => {
    dispatch(setOrganizationData({
        ...organization,
        id: workspaceId,
    }))
    navigation.navigate("PageBoards" as never)
  }

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>My workspaces</Text>
      <View>
        {workspaces?.map((workspace, index) => (
          <Cards title={workspace.displayName} key={index} onPress={() => handleSelectOrganization(workspace.id)}/>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
});
