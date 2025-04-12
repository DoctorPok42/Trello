import boards from "@/app/(tabs)/boards";
import { MaterialSymbolsArrowCircleRightOutline } from "@/components/icons/MaterialSymbolsArrowCircleRightOutline";
import { ListCard } from "@/components/trello/ListCard";
import React from "react";
import { FlatList, TouchableOpacity, View, StyleSheet, Text, Dimensions } from "react-native";
import { GestureHandlerRootView, Swipeable,} from "react-native-gesture-handler";

interface ItemsListProps {
  renameAction: (itemId: string) => void;
  deleteAction: (itemId: string) => void;
  redirectAction: (itemId: string, name?: string) => void;
  givenItem: string;
  data: any[];
}

const ButtonAction = ({ onPress, label, backgroundColor } : 
    { onPress: () => void; label: string; backgroundColor: string; }) => (
  <TouchableOpacity onPress={onPress} style={[styles.actionButton, { backgroundColor }]}>
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

export const ItemsList: React.FC<ItemsListProps> = ({ renameAction, deleteAction, redirectAction, givenItem, data }) => {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {data && data.length > 0 ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 5, paddingHorizontal: 10 }}>
                <Swipeable
                  key={item.id}
                  renderLeftActions={() => (
                    <>
                      <ButtonAction
                        onPress={() => renameAction(item.id)}
                        label="Rename"
                        backgroundColor="orange"
                      />
                    </>
                  )}
                  renderRightActions={() => (
                    <>
                      <ButtonAction
                        onPress={() => deleteAction(item.id)}
                        label="Delete"
                        backgroundColor="rgb(255, 53, 53)"
                      />
                    </>
                  )}
                >
                  {givenItem === "Workspaces" ? (
                    <ListCard
                      svg={<MaterialSymbolsArrowCircleRightOutline />}
                      title={item.displayName}
                      hasData={false}
                      onPress={() => redirectAction(item.id, item.displayName)}
                    />
                  ) : (
                    <ListCard
                      svg={<MaterialSymbolsArrowCircleRightOutline />}
                      title={item.name}
                      hasData={false}
                      onPress={() => redirectAction(item.id, item.displayName)}
                    />
                  )}
                </Swipeable>
              </View>
            )}
          />
        ) : (
          <Text>No {givenItem} yet</Text>
        )}
      </GestureHandlerRootView>
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