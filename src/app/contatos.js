import { Stack } from "expo-router";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("contatos.db");

// db.execSync(`DROP TABLE contato`);

db.execSync(`
  CREATE TABLE IF NOT EXISTS contato (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(11) NOT NULL
  );
`);

function selectFromDB() {
  return db.getAllSync("SELECT * FROM contato ORDER BY id DESC");
}

function insertIntoDB(name, phone) {
  db.runSync("INSERT INTO contato (nome, telefone) VALUES (?, ?)", [name, phone]);
}

function updateFromDB(name, phone, id) {
  db.runSync("UPDATE contato SET nome = ?, telefone = ? WHERE id = ?", [name, phone, id]);
}

function deleteFromDB(id) {
  db.runSync("DELETE FROM contato WHERE id = (?)", [id]);
}

export default function Contatos() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentId, setCurrentId] = useState(0); 
  const [list, setList] = useState([]);

  function refreshList() {
    setList(selectFromDB());
  }

  function cleanInputs() {
    setName("");
    setPhone("");
  }

  function saveItemToList() {
    if (currentId === 0) {
      insertIntoDB(name, phone);
    } else {
      updateFromDB(name, phone, currentId);
      setCurrentId(0);
    }
    cleanInputs();
    refreshList();
  }

  function loadItemToEdit(item) {
    setCurrentId(item.id);
    setName(item.nome);
    setPhone(item.telefone);
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
      <Stack.Screen options={{ title: "Agenda de contatos" }} />

      <View style={styles.header}>
        <Text style={styles.title}>Agenda de contatos</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.field}
          value={name}
          onChangeText={setName}
          placeholder="Nome..."
          placeholderTextColor="#7b827a"
          autoFocus={true}
        />

        <TextInput
          style={styles.field}
          value={phone}
          onChangeText={setPhone}
          maxLength={11}
          placeholder="Telefone..."
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
              <Text style={styles["item-text"]}>{item.nome}</Text>
              <Text style={styles["item-subtext"]}>{item.telefone}</Text>
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