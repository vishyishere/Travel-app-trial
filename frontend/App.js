import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, Button, FlatList, View, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";

const CATEGORIES = ["movies", "sightseeing", "food"];
const PLACES = ["Kochi"]; // add more cities here later

// production backend
const backendUrl = "https://travel-app-trial.onrender.com";

export default function App() {
  const [budget, setBudget] = useState("");
  const [currency] = useState("INR");
  const [category, setCategory] = useState("movies");
  const [place, setPlace] = useState(PLACES[0]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    if (!budget) return Alert.alert("Enter budget");
    if (!place) return Alert.alert("Select a place");
    setLoading(true);

    const payload = { budget: Number(budget), category, location: { place } };

    try {
      const res = await axios.post(`${backendUrl}/budget`, payload, { timeout: 10000 });
      setResults(res?.data?.suggestions || []);
    } catch (err) {
      console.error("fetchSuggestions error", err?.response || err?.message || err);
      Alert.alert("Error", "Could not reach backend. Is it running and accessible?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Budget Travel — Demo</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            placeholder="Budget"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <Text style={styles.currencyLabel}>{currency}</Text>
        </View>

        <Text style={{ marginTop: 12, marginBottom: 6, fontWeight: "600" }}>Select Place</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
          {PLACES.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPlace(p)}
              style={[styles.placeBtn, place === p && styles.placeBtnActive]}
            >
              <Text style={place === p ? styles.placeTextActive : styles.placeText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.categoryRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity key={c} onPress={() => setCategory(c)} style={[styles.catBtn, category === c && styles.catBtnActive]}>
              <Text style={category === c ? styles.catTextActive : styles.catText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title={loading ? "Loading..." : `Find ${category} in ${place}`} onPress={fetchSuggestions} disabled={loading} />

        <FlatList
          style={{ marginTop: 20 }}
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.distanceKm != null ? <Text>Distance: {item.distanceKm} km</Text> : null}
              <Text style={{ marginTop: 6, fontWeight: "600" }}>Breakdown:</Text>
              {item.breakdown?.map((b, i) => (
                <Text key={i}> {b.label}: ₹{b.amount}</Text>
              ))}
              <Text style={{ marginTop: 8, fontWeight: "700" }}>Total: ₹{item.totalEstimate}</Text>
              {item.overBudget ? <Text style={{ color: "red" }}>Over budget</Text> : null}
            </View>
          )}
          ListEmptyComponent={<Text style={{ marginTop: 20 }}>No suggestions yet</Text>}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, padding: 8, borderRadius: 6, borderColor: "#ddd" },
  currencyLabel: { marginLeft: 8, alignSelf: "center", fontWeight: "600" },
  categoryRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  catBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6, borderColor: "#ccc" },
  catBtnActive: { backgroundColor: "#0066ff", borderColor: "#0066ff" },
  catText: { color: "#000" },
  catTextActive: { color: "#fff" },
  placeBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6, borderColor: "#ccc" },
  placeBtnActive: { backgroundColor: "#00a86b", borderColor: "#00a86b" },
  placeText: { color: "#000" },
  placeTextActive: { color: "#fff" },
  card: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 10, borderColor: "#eee" },
  cardTitle: { fontWeight: "700", marginBottom: 6 }
});
