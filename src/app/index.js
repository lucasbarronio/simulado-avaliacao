import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={styles["app"]}>
      <Stack.Screen options={{ title: "Painel" }} />

      <ScrollView>
        <View style={styles["header"]}>
          <View style={styles["avatar"]} />
          <View>
            <Text style={styles["greetings"]}>Olá, Estudante</Text>
            <Text style={styles["subtitle"]}>Bem-vindo de volta</Text>
          </View>
        </View>
        <View style={styles["card"]}>
          <View style={styles["card-header"]}>
            <Text style={styles["card-title"]}>Agenda de contatos</Text>
          </View>
          <Link href="/contatos" style={styles["card-link"]}>
            Agenda de contatos →
          </Link>
        </View>
        <View style={styles["card"]}>
          <View style={styles["card-header"]}>
            <Text style={styles["card-title"]}>Biblioteca pessoal</Text>
          </View>
          <Link href="/biblioteca" style={styles["card-link"]}>
            Biblioteca pessoal →
          </Link>
        </View>
        <View style={styles["card"]}>
          <View style={styles["card-header"]}>
            <Text style={styles["card-title"]}>Lista de compras</Text>
          </View>
          <Link href="/compras" style={styles["card-link"]}>
            Lista de compras →
          </Link>
        </View>
        <View style={styles["card"]}>
          <View style={styles["card-header"]}>
            <Text style={styles["card-title"]}>Avaliação de filmes</Text>
          </View>
          <Link href="/filmes" style={styles["card-link"]}>
            Avaliação de filmes →
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#f3f2ee",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#dfe7d5",
  },

  greetings: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f1f1f",
  },

  subtitle: {
    fontSize: 14,
    color: "#5e665a",
    marginTop: 2,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#e6e3dd",
  },

  'card-header': {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  'card-title': {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f1f1f",
    flexShrink: 1,
  },
  'card-link': {
    fontSize: 15,
    fontWeight: "600",
    color: "#538532",
    marginTop: 4,
  },
});