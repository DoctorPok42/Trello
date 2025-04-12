import { IonCreate } from "@/components/icons/IonCreate";
import { Header } from "@/components/trello/Header";
import { ListCard } from "@/components/trello/ListCard";
import store, { RootState } from "@/store";
import { setBoardData } from "@/store/slices/boardSlice";
import {
  createBoardByOrganizationId,
  getBoards,
  getBoardsByID,
} from "@/utils/trello/boards";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, Alert, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

interface BoardsProps {
  displayAllBoards?: boolean;
}

export const PageBoards: React.FC<BoardsProps> = ({
  displayAllBoards = false,
}) => {
  const [boards, setBoards] = useState<any[]>();
  const board = useSelector((state: RootState) => state.board.data);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [organizationId, setOrganizationId] = useState<string>(
    store.getState().organization.id
  );
  const [organizationName, setOrganizationName] = useState(
    store.getState().organization.name
  );

  const fetchBoards = async () => {
    if (!displayAllBoards) {
      const responseData = await getBoardsByID(organizationId);
      if (responseData) setBoards(responseData);
    } else {
      const responseData = await getBoards();
      if (responseData) setBoards(responseData);
    }
  };

  const handleCreateBoard = async () => {
    Alert.prompt("New board", "Type board's name.", async (name) => {
      const response = await createBoardByOrganizationId(name, organizationId);
      if (response) {
        await fetchBoards();
        Toast.success("Board created.");
      } else Toast.error("Error during board creation.");
    });
  };

  const handleSelectBoard = (boardId: string) => {
    const dataToSet = { ...board, id: boardId };
    dispatch(setBoardData(dataToSet));
    navigation.navigate("PageLists" as never);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={{paddingBottom: 100}}>
      {displayAllBoards ? (
        <Header
          title="All Boards"
          svg={<IonCreate />}
          action={handleCreateBoard}
        />
      ) : (
        <Header
          title={`Boards in ${organizationName}`}
          svg={<IonCreate />}
          action={handleCreateBoard}
        />
      )}
      {board && boards?.length ? (
        boards.map((board, index) => (
          <ListCard
            title={board.name}
            hideArrow={true}
            key={index}
            onPress={() => handleSelectBoard(board.id)}
          />
        ))
      ) : (
        <Text style={styles.noBoard}>No board yet</Text>
      )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },

  noBoard: {
    color: "gray",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
});
