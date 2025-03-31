import { Picker } from '@react-native-picker/picker';
import { View, Text, Dimensions } from 'react-native';
import { Modal, Portal, SegmentedButtons, TextInput } from 'react-native-paper';

const containerStyle = {
  backgroundColor: 'white',
  padding: 10,
  margin: 20,
  borderRadius: 10,
  width: Dimensions.get('window').width - 40,
};

interface MenuPopupProps {
  visible: "Board" | "Workspace" | null;
  setVisible: (value: "Board" | "Workspace" | null) => void;
  handleAdd: (name: string) => void;
  handleEdit: (name: string) => void;
  edit: string | null;
  setEdit: (value: string | null) => void;
  boards?: any[];
  selectedTemplateId?: string | null;
  setSelectedTemplateId?: (value: string | null) => void;
  boardCreationType?: string;
  setBoardCreationType?: (value: string) => void;
}

const MenuPopup = ({
  visible,
  setVisible,
  handleAdd,
  handleEdit,
  edit,
  setEdit,
  boards = [],
  selectedTemplateId = null,
  setSelectedTemplateId = () => {},
  boardCreationType = "none",
  setBoardCreationType = () => {},
}: MenuPopupProps) => {
  return (
    <Portal>
      <Modal visible={!!visible} onDismiss={() => setVisible(null)} contentContainerStyle={containerStyle}>
        {visible === "Board" ? (
          <View>
            <SegmentedButtons
              value={boardCreationType}
              onValueChange={setBoardCreationType}
              style={{
                marginTop: 10,
                marginHorizontal: 10,
                marginBottom: 10,
              }}
              theme={
                {
                  colors: {
                    secondaryContainer: 'rgba(0, 121, 191, 0.4)',
                    onSecondaryContainer: '#fff',
                    outline: "#0079BF"
                  },
                }
              }
              buttons={[
                {
                  value: 'none',
                  label: 'From scratch',
                  icon: 'clipboard-plus-outline',
                },
                {
                  value: 'template',
                  label: 'From template',
                  icon: 'clipboard-multiple-outline',
                },
              ]}
            />

            {boardCreationType === "template" && (
              <>
                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Select a template</Text>
                <View style={{
                  borderRadius: 5,
                  marginTop: 10,
                  backgroundColor: '#fff',
                  marginBottom: 10,
                  elevation: 3,
                }}>
                  <Picker
                    selectedValue={selectedTemplateId}
                    onValueChange={(itemValue) => setSelectedTemplateId(itemValue)}
                    mode='dialog'
                    prompt="Select a template"
                  >
                    {boards.map(board => (
                      <Picker.Item key={board.id} label={board.name} value={board.id} />
                    ))}
                  </Picker>
                </View>
              </>
            )}

            <TextInput mode="outlined" placeholder="Board name..." autoFocus onSubmitEditing={(e) => handleAdd(e.nativeEvent.text)} />
          </View>
        ) : (
          <TextInput mode="outlined" placeholder="Workspace name..." autoFocus onSubmitEditing={(e) => handleAdd(e.nativeEvent.text)} />
        )}
      </Modal>

      <Modal visible={!!edit} onDismiss={() => setEdit(null)} contentContainerStyle={containerStyle}>
        <TextInput mode="outlined" autoFocus onSubmitEditing={(e) => handleEdit(e.nativeEvent.text)} value={edit} onChangeText={setEdit} />
      </Modal>
    </Portal>
  );
};

export default MenuPopup;