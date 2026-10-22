import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const base = process.env.EXPO_PUBLIC_HR_URL ?? "http://127.0.0.1:5006";
type Employee = {
  employee_id: string;
  display_name: string;
  department: string;
  work_email: string;
};
export default function App() {
  const [people, setPeople] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [leave, setLeave] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch(`${base}/v1/employees`)
      .then((response) => {
        if (!response.ok) throw new Error("People directory unavailable");
        return response.json();
      })
      .then((rows) => {
        if (active) setPeople(rows);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function select(employee: Employee) {
    setSelected(employee);
    setLeave(null);
    setError("");
    try {
      const responses = await Promise.all([
        fetch(`${base}/v1/employees/${employee.employee_id}`),
        fetch(`${base}/v1/employees/${employee.employee_id}/leave`),
      ]);
      if (responses.some((response) => !response.ok))
        throw new Error("Profile unavailable");
      const [, snapshot] = await Promise.all(
        responses.map((response) => response.json()),
      );
      setLeave(snapshot.annual_days_remaining);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profile unavailable");
    }
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>NORTHSTAR PEOPLE</Text>
          <Text style={styles.title}>Hello, colleague.</Text>
          {loading ? <ActivityIndicator /> : null}
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
          {selected ? (
            <View style={styles.detail}>
              <Text style={styles.name}>{selected.display_name}</Text>
              <Text style={styles.text}>{selected.department}</Text>
              <Text style={styles.text}>{selected.work_email}</Text>
              <Text style={styles.text}>
                {leave === null
                  ? "Loading leave snapshot…"
                  : `${leave} annual leave days remaining`}
              </Text>
              <Pressable
                accessibilityRole="button"
                style={styles.button}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.buttonText}>Back to directory</Text>
              </Pressable>
            </View>
          ) : null}
          {people.map((employee) => (
            <Pressable
              accessibilityRole="button"
              style={styles.card}
              key={employee.employee_id}
              onPress={() => select(employee)}
            >
              <Text style={styles.name}>{employee.display_name}</Text>
              <Text style={styles.text}>{employee.department}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f5f8" },
  page: { padding: 24, maxWidth: 760, width: "100%", alignSelf: "center" },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#182637",
    marginVertical: 12,
  },
  eyebrow: { color: "#ad480d", fontWeight: "700", letterSpacing: 2 },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 20,
    marginVertical: 8,
    borderColor: "#dce2ea",
    borderWidth: 1,
  },
  name: { fontSize: 19, fontWeight: "600", color: "#182637", marginBottom: 8 },
  text: { color: "#43536a", marginVertical: 4 },
  button: {
    backgroundColor: "#c95318",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: { color: "white", fontWeight: "600" },
  error: { color: "#a12525", padding: 12 },
  detail: {
    backgroundColor: "#e8f4ef",
    padding: 18,
    borderRadius: 12,
    marginVertical: 12,
  },
});
