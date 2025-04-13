import { MaterialSymbolsArrowCircleRightOutline } from "@/components/icons/MaterialSymbolsArrowCircleRightOutline";
import { MaterialSymbolsArrowDropDownCircleOutline } from "@/components/icons/MaterialSymbolsArrowDropDownCircleOutline";
import { CardPopup } from "@/components/trello/CardPopup";
import { Label } from "@/components/trello/Label";
import { Card } from "@/types/Card";
import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Dimensions,
  GestureResponderEvent,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

interface ManageLabelsProps {
  renameAction: (itemId: string) => void;
  deleteAction: (itemId: string) => void;
  redirectAction?: (itemId: string, name?: string) => void;
  givenItem: string;
  data: any[];
  cards?: Card[];
  handleCreateCard?: (event: GestureResponderEvent) => void;
  readAction?: () => void;
  openCard?: boolean;
}

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
    style={
      label === "Delete"
        ? [styles.actionButton, styles.actionButtonRight, { backgroundColor }]
        : [styles.actionButton, styles.actionButtonLeft, { backgroundColor }]
    }
  >
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

export const ManageLabels: React.FC<ManageLabelsProps> = ({
  renameAction,
  deleteAction,
  redirectAction,
  readAction,
  givenItem,
  data,
  handleCreateCard,
}) => {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {data && data.length > 0 ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 1, paddingHorizontal: 10 }}>
                <Swipeable
                  key={item.id}
                  renderLeftActions={() => (
                    <>
                      {readAction && (
                        <ButtonAction
                          onPress={() => readAction()}
                          label="Read"
                          backgroundColor="#377ef6"
                        />
                      )}
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
                  {givenItem === "Workspaces" && (
                    <Label
                      svg={<MaterialSymbolsArrowCircleRightOutline />}
                      title={item.displayName}
                      onPress={() => redirectAction!(item.id, item.displayName)}
                    />
                  )}

                  {givenItem === "Boards" && (
                    <Label
                      svg={<MaterialSymbolsArrowCircleRightOutline />}
                      title={item.name}
                      onPress={() => redirectAction!(item.id)}
                    />
                  )}

                  {givenItem === "Lists" && (
                    <>
                      <Label
                        svg={<MaterialSymbolsArrowDropDownCircleOutline />}
                        title={item.name}
                        listId={item.id}
                        noRoundBorder={true}
                        handleCreateCard={(event: GestureResponderEvent) =>
                          handleCreateCard && handleCreateCard(event)
                        }
                      />
                    </>
                  )}

                  {givenItem === "Cards" && (
                    <>
                      <CardPopup
                        visible={openCardId === item.id}
                        card={item}
                        onClose={() => setOpenCardId(null)}
                      />
                      <Label
                        svg={<MaterialSymbolsArrowDropDownCircleOutline />}
                        card={item}
                        title={item.name}
                        onPress={() => setOpenCardId(item.id)}
                      />
                    </>
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
    height: Dimensions.get("screen").height * 0.065,
  },
  actionButtonRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  actionButtonLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
