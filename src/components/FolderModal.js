import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { getFolders, addToFolder } from '../storage/watchlistStorage';
import { useTheme } from '../theme/ThemeProvider';
import { colors } from '../constants/colors';

export default function FolderModal({ visible, onClose, symbol }) {
  const [folderName, setFolderName] = useState('');
  const [folders, setFolders] = useState([]);
  const theme = useTheme();
  const themeColors = colors[theme];

  const loadFolders = async () => {
    const f = await getFolders();
    setFolders(f);
  };

  React.useEffect(() => {
    if (visible) loadFolders();
  }, [visible]);

  const handleAdd = async (folder) => {
    await addToFolder(symbol, folder);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.centered}>
        <View style={[styles.modal, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.header, { color: themeColors.text }]}>Select Folder</Text>
          <FlatList
            data={folders}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAdd(item)} style={styles.item}>
                <Text style={{ color: themeColors.text }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TextInput
            placeholder="New folder name"
            placeholderTextColor="#888"
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.primary }]}
            value={folderName}
            onChangeText={setFolderName}
          />
          <TouchableOpacity
            onPress={() => handleAdd(folderName)}
            style={[styles.button, { backgroundColor: themeColors.primary }]}
          >
            <Text style={{ color: '#fff' }}>Add to Folder</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: themeColors.secondary, marginTop: 10 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    padding: 16,
    borderRadius: 10,
    width: '80%',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 8,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
