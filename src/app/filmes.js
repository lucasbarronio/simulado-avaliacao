import { Stack } from "expo-router";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("filmes.db");

// db.execSync(`DROP TABLE compra`);

db.execSync(`
  CREATE TABLE IF NOT EXISTS filme (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(255) NOT NULL,
    nota DECIMAL(10,1) NOT NULL DEFAULT 0.0
  );
`);

function selectFromDB() {
  return db.getAllSync("SELECT * FROM filme ORDER BY id DESC");
}

function insertIntoDB(title, rating) {
  db.runSync("INSERT INTO filme (titulo, nota) VALUES (?, ?)", [title, rating]);
}

function updateFromDB(title, rating, id) {
  db.runSync("UPDATE filme SET titulo = ?, nota = ? WHERE id = ?", [title, rating, id]);
}

function deleteFromDB(id) {
  db.runSync("DELETE FROM filme WHERE id = (?)", [id]);
}


export default function Compras() {
  const [currentId, setCurrentId] = useState(0);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [list, setList] = useState([]);

  function refreshList() {
    setList(selectFromDB());
  }

  function cleanInputs() {
    setTitle("");
    setRating("");
  }

  function saveItemToList() {
    if (currentId === 0) {
      insertIntoDB(title, rating);
    } else {
      updateFromDB(title, rating, currentId);
      setCurrentId(0);
    }
    cleanInputs();
    refreshList();
  }

  function loadItemToEdit(item) {
    setCurrentId(item.id);
    setTitle(item.titulo);
    setRating(String(item.nota));
  }

  function removeItemFromList(id) {
    deleteFromDB(id);
    setCurrentId(0);
    cleanInputs();
    refreshList();
  }

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Avaliação de filmes" }} />

      <View style={styles.header}>
        <Text style={styles.title}>Avaliação de filmes</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.field}
          value={title}
          onChangeText={setTitle}
          placeholder="Título..."
          placeholderTextColor="#7b827a"
          autoFocus={true}
        />

        <TextInput
          style={styles.field}
          value={rating}
          onChangeText={setRating}
          inputMode="decimal"
          maxLength={2}
          placeholder="Nota..."
          placeholderTextColor="#7b827a"
        />
      </View>

      <View style={styles["button-wrapper"]}>
        <Button title="Registrar" onPress={saveItemToList} color="#538532" />
      </View>

      <FlatList style={styles.list}
        data={list}
        renderItem={({ item }) => (
          <View style={[styles['item'], {backgroundColor: item.nota >= 7 ? "#add890" : "#ffffff"}]}>
            <View style={styles['item-content']}>
              <Text style={styles["item-text"]}>{item.titulo}</Text>
              <Text style={styles["item-subtext"]}>{item.nota}</Text>
            </View>
            <View style={styles.circle}>
              <Button title="E" onPress={() => { loadItemToEdit(item) }} color="#5f6d5d" />
            </View>
            <View style={styles.circle}>
              <Button title="X" onPress={() => { removeItemFromList(item.id) }} color="#853A32" />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  'debug': {
    borderColor: '#fe0000',
    borderWidth: 2,
  },
  'container': {
    backgroundColor: "#f5f4f1",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  'header': {
    marginBottom: 20,
  },
  'title': {
    color: "#1f1f1f",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  'subtitle': {
    color: "#68756b",
    fontSize: 14,
  },
  'form': {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  'field': {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dfe3dc",
    borderRadius: 10,
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#1f1f1f",
  },
  'button-wrapper': {
    backgroundColor: "#6b8e4e",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },
  'list': {
    flex: 1,
    marginTop: 24,
  },
  'item': {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e1e4df",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 10,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10
  },
  'item-content': {
    alignItems: 'center',
    flexDirection: "row",
    flex: 1,
    gap: 20,
  },
  'item-text': {
    color: "#1f1f1f",
    fontSize: 16,
  },
  'item-subtext': {
    color: "#68756b",
    fontSize: 12,
  },
  'circle': {
    width: 32,
    height: 32,
    borderRadius: 50,
    overflow: "hidden",
  },
});