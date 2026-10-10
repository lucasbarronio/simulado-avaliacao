import { Stack } from "expo-router";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("biblioteca.db");

// db.execSync(`DROP TABLE biblioteca`);

db.execSync(`
  CREATE TABLE IF NOT EXISTS biblioteca (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    paginas INTEGER NOT NULL
  );
`);

function selectFromDB() {
  return db.getAllSync("SELECT * FROM biblioteca ORDER BY id DESC");
}

function insertIntoDB(title, author, pages) {
  db.runSync("INSERT INTO biblioteca (titulo, autor, paginas) VALUES (?, ?, ?)", [title, author, pages]);
}

function updateFromDB(title, author, pages, id) {
  db.runSync("UPDATE biblioteca SET titulo = ?, autor = ?, paginas = ? WHERE id = ?", [title, author, pages, id]);
}

function deleteFromDB(id) {
  db.runSync("DELETE FROM biblioteca WHERE id = (?)", [id]);
}

export default function Biblioteca() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [list, setList] = useState([]);

  function refreshList() {
    setList(selectFromDB());
  }

  function cleanInputs() {
    setTitle("");
    setAuthor("");
    setPages(0);
  }

  function saveItemToList() {
    if (currentId === 0) {
      insertIntoDB(title, author, pages);
    } else {
      updateFromDB(title, author, pages, currentId);
      setCurrentId(0);
    }
    cleanInputs();
    refreshList();
  }

  function loadItemToEdit(item) {
    setCurrentId(item.id);
    setTitle(item.titulo);
    setAuthor(item.autor);
    setPages(String(item.paginas));
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
      <Stack.Screen options={{ title: "Biblioteca pessoal" }} />

      <View style={styles.header}>
        <Text style={styles.title}>Biblioteca pessoal</Text>
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
          value={author}
          onChangeText={setAuthor}
          placeholder="Autor..."
          placeholderTextColor="#7b827a"
        />

        <TextInput
          style={styles.field}
          value={pages}
          onChangeText={setPages}
          inputMode="numeric"
          placeholder="Páginas..."
          placeholderTextColor="#7b827a"
        />
      </View>

      <View style={styles["button-wrapper"]}>
        <Button title="Registrar" onPress={saveItemToList} color="#538532" />
      </View>

      <FlatList style={styles.list}
        data={list}
        renderItem={({ item }) => (
          <View style={styles['item']}>
            <View style={styles['item-content']}>
              <Text style={styles["item-text"]}>{item.titulo}</Text>
              <Text style={styles["item-subtext"]}>{item.autor}</Text>
              <Text style={styles["item-subtext"]}>{item.paginas}</Text>
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