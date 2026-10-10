import { Stack } from "expo-router";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("compras.db");

// db.execSync(`DROP TABLE compra`);

db.execSync(`
  CREATE TABLE IF NOT EXISTS compra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item VARCHAR(255) NOT NULL,
    quantidade VARCHAR(50) NOT NULL,
    comprado INTEGER NOT NULL DEFAULT 0
  );
`);

function selectFromDB() {
  return db.getAllSync("SELECT * FROM compra ORDER BY id DESC");
}

function insertIntoDB(item, quantity) {
  db.runSync("INSERT INTO compra (item, quantidade) VALUES (?, ?)", [item, quantity]);
}

function updateFromDB(item, quantity, id) {
  db.runSync("UPDATE compra SET item = ?, quantidade = ? WHERE id = ?", [item, quantity, id]);
}

function deleteFromDB(id) {
  db.runSync("DELETE FROM compra WHERE id = (?)", [id]);
}

function setPurchasedFromDB(id) {
  db.runSync("UPDATE compra SET comprado = 1 WHERE id = ?", [id]);
}

function deletePurchasedFromDB() {
  db.runSync("DELETE FROM compra WHERE comprado = 1");
}

export default function Compras() {
  const [currentId, setCurrentId] = useState(0);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchased, setPurchased] = useState(0);
  const [list, setList] = useState([]);

  function refreshList() {
    setList(selectFromDB());
  }

  function cleanInputs() {
    setItem("");
    setQuantity(0);
    setPurchased(0);
  }

  function saveItemToList() {
    if (currentId === 0) {
      insertIntoDB(item, quantity, purchased);
    } else {
      updateFromDB(item, quantity, currentId);
      setCurrentId(0);
    }
    cleanInputs();
    refreshList();
  }

  function loadItemToEdit(item) {
    setCurrentId(item.id);
    setItem(item.item);
    setQuantity(String(item.quantidade));
    setPurchased(item.comprado);
  }

  function removeItemFromList(id) {
    deleteFromDB(id);
    setCurrentId(0);
    cleanInputs();
    refreshList();
  }

  function purchaseItem(id) {
    setPurchasedFromDB(id);
    setCurrentId(0);
    cleanInputs();
    refreshList();
  }

  function deletePurchased() {
    deletePurchasedFromDB();
    setCurrentId(0);
    cleanInputs();
    refreshList();
  }

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Lista de compras" }} />

      <View style={styles.header}>
        <Text style={styles.title}>Lista de compras</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.field}
          value={item}
          onChangeText={setItem}
          placeholder="Item..."
          placeholderTextColor="#7b827a"
          autoFocus={true}
        />

        <TextInput
          style={styles.field}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Quantidade..."
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
              <Text style={[styles["item-text"], {textDecorationLine: item.comprado === 1 ? "line-through" : "none"}]}>{item.item}</Text>
              <Text style={[styles["item-subtext"], {textDecorationLine: item.comprado === 1 ? "line-through" : "none"}]}>{item.quantidade}</Text>
            </View>
            <View style={styles.circle}>
              <Button title="E" onPress={() => { loadItemToEdit(item) }} color="#5f6d5d" />
            </View>
            <View style={styles.circle}>
              <Button title="X" onPress={() => { removeItemFromList(item.id) }} color="#853A32" />
            </View>
            <View style={styles.circle}>
              <Button title="C" onPress={() => { purchaseItem(item.id) }} color="#1975d8" />
            </View>
          </View>
        )}
      />

      <View style={styles["button-wrapper"]}>
        <Button title="LIMPAR COMPRADOS" onPress={deletePurchased} color="#853A32" />
      </View>
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