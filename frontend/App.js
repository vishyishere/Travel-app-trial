import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, Button, FlatList, View, StyleSheet, Alert } from "react-native";
import axios from "axios";

export default function App() {
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState([]);
  const backendUrl = "http://10.0.2.2:4000"; // emulator default; use PC LAN IP on a real device

  const fetchSuggestions = async () => {
    if (!budget) return Alert.alert("Please enter budget");
    try {
      const res = await axios.post(`${backendUrl}/budget`, { budget });
      setResults(res.data.suggestions || []);
    } catch (err) {
      Alert.alert("Error", "Could not reach backend");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Travel App (Demo)</Text>
      <TextInput style={styles.input} placeholder="Budget" value={budget} onChangeText={setBudget} keyboardType="numeric" />
      <Button title="Find" onPress={fetchSuggestions} />
      <FlatList data={results} keyExtractor={i=>i.id} renderItem={({item})=>(
        <View style={styles.card}>
          <Text style={{fontWeight: "700"}}>{item.title}</Text>
          <Text>Total: ?{item.totalEstimate}</Text>
        </View>
      )} ListEmptyComponent={<Text>No suggestions</Text>} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  title: { fontSize:20, fontWeight:"700" },
  input: { borderWidth:1, padding:8, marginVertical:12 },
  card: { padding:10, borderWidth:1, marginVertical:6 }
});
