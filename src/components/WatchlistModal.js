import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, TextInput, Pressable, StyleSheet } from 'react-native';
import { addToFolder, getFolders } from '../storage/watchlistStorage'; 

export default function WatchlistModal({ visible, onClose, stock }) {
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState('');

  const loadFolders = async () => {
    const data = await getFolders();
    setFolders(data);
  };

  useEffect(() => {
    if (visible) loadFolders();
  }, [visible]);

  const handleCreateAndAdd = async () => {
    if (!newFolder.trim()) return;
    await addToFolder(stock, newFolder);
    setNewFolder('');
    onClose();
  };

  const handleSelect = async (folder) => {
    await addToFolder(stock, folder);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Add to Watchlist</Text>

          <TextInput
            placeholder="New folder name"
            value={newFolder}
            onChangeText={setNewFolder}
            style={styles.input}
          />
          <Pressable onPress={handleCreateAndAdd}>
            <Text style={styles.createBtn}>+ Create and Add</Text>
          </Pressable>

          <FlatList
            data={folders}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleSelect(item)} style={styles.item}>
                <Text>{item}</Text>
              </Pressable>
            )}
          />

          <Pressable onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' },
  container: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: '80%',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingVertical: 8,
    marginBottom: 12,
  },
  createBtn: { color: 'blue', marginBottom: 10 },
  item: { paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  cancel: { color: 'red', marginTop: 20, textAlign: 'center' },
});
