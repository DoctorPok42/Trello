import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialSymbolsArrowCircleRightOutline } from "../icons/MaterialSymbolsArrowCircleRightOutline";

interface CardsProps {
  title?: string;
  onPress?: () => void;
  customHeight?: number;
  creationDate?: string;
  hideArrow?: boolean;
}

export const ListCard: React.FC<CardsProps> = ({ title, onPress, customHeight = 75, creationDate, hideArrow=false }) => {

  let customStyle: { height: number } = {
    height: customHeight,
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={[styles.subContainer, customStyle]} onPress={onPress} activeOpacity={0.7}>
            <View style={{flexDirection: "row", alignItems:"center", justifyContent:"space-between"}}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.textSmall}>{creationDate}</Text>
            {!hideArrow && <MaterialSymbolsArrowCircleRightOutline /> }
            </View>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    subContainer: {
    width: "100%",
    backgroundColor: "#F1F6FD",
    justifyContent: "center",
    marginVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#7791A3"
  },
  text: {
    fontSize: 24,
    fontWeight: 600,
    color: "#0F5D81",
    textAlign: "left",
  },

  textSmall:  {
    fontSize: 20,
    fontWeight: 600,
    color: "#0F5D81",
    textAlign: "left",    
  }
});
