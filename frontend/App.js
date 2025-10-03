import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, Button, FlatList, View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import axios from "axios";

const CATEGORIES = ["movies", "sightseeing", "food"];

export default function App() {
  const [budget, setBudget] = useState("");
  const [currency] = useState("INR");
  const [category, setCategory] = useState("movies");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // For emulator use 127.0.0.1:4000. For phone use LAN ip:4000
  const backendUrl = "http://127.0.0.1:4000";

  const fetchSuggestions = async () => {
    if (!budget) return Alert.alert("Enter budget");
    setLoading(true);
    const payload = { budget: Number(budget), category };
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!isNaN(latNum) && !isNaN(lngNum)) payload.location = { lat: latNum, lng: lngNum };

    try {
      const res = await axios.post(`${backendUrl}/budget`, payload, { timeout: 7000 });
      setResults(res.data.suggestions || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not reach backend. Is it running and accessible?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.categoryRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)} style={[styles.catBtn, category === c && styles.catBtnActive]}>
            <Text style={category === c ? styles.catTextActive : styles.catText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ marginTop: 8 }}>Optional: lat, lng (for travel estimate)</Text>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
        <TextInput placeholder="lat" value={lat} onChangeText={setLat} keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
        <TextInput placeholder="lng" value={lng} onChangeText={setLng} keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
      </View>

      <Button title={loading ? "Loading..." : `Find ${category}`} onPress={fetchSuggestions} disabled={loading} />

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
              <Text key={i}> {b.label}: ?{b.amount}</Text>
            ))}
            <Text style={{ marginTop: 8, fontWeight: "700" }}>Total: ?{item.totalEstimate}</Text>
            {item.overBudget ? <Text style={{ color: "red" }}>Over budget</Text> : null}
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No suggestions yet</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
  },
  currencyLabel: { marginLeft: 8, alignSelf: "center", fontWeight: "600" },
  categoryRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  catBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6 },
  catBtnActive: { backgroundColor: "#0066ff", borderColor: "#0066ff" },
  catText: { color: "#000" },
  catTextActive: { color: "#fff" },
  card: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  cardTitle: { fontWeight: "700", marginBottom: 6 }
});
