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

const base = process.env.EXPO_PUBLIC_GATEWAY_URL ?? "http://127.0.0.1:5001";
type Product = {
  sku: string;
  name: string;
  price_minor: number;
  stock_on_hand: number;
};
type Order = { id: string; status: string; total_minor: number };
export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`${base}/v1/products`),
      fetch(`${base}/v1/orders`, { headers: { "x-demo-user-id": "cus-001" } }),
    ])
      .then(async (responses) => {
        if (responses.some((response) => !response.ok))
          throw new Error("Equipment service unavailable");
        return Promise.all(responses.map((response) => response.json()));
      })
      .then(([catalog, history]) => {
        if (active) {
          setProducts(catalog);
          setOrders(history);
        }
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
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>NORTHSTAR EQUIPMENT</Text>
          <Text style={styles.title}>Your workday, equipped.</Text>
          {loading ? <ActivityIndicator /> : null}
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
          {selected ? (
            <View style={styles.detail}>
              <Text style={styles.name}>{selected.name}</Text>
              <Text style={styles.text}>
                {selected.sku} · {selected.stock_on_hand} available
              </Text>
              <Text style={styles.text}>
                ${(selected.price_minor / 100).toFixed(2)} USD
              </Text>
              <Pressable
                accessibilityRole="button"
                style={styles.button}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.buttonText}>Close details</Text>
              </Pressable>
            </View>
          ) : null}
          {products.map((product) => (
            <Pressable
              accessibilityRole="button"
              style={styles.card}
              key={product.sku}
              onPress={() => setSelected(product)}
            >
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.text}>
                ${(product.price_minor / 100).toFixed(2)} · View details
              </Text>
            </Pressable>
          ))}
          <Text style={styles.title}>Recent orders</Text>
          {orders.map((order) => (
            <View style={styles.card} key={order.id}>
              <Text style={styles.name}>{order.id}</Text>
              <Text style={styles.text}>
                {order.status} · ${(order.total_minor / 100).toFixed(2)}
              </Text>
            </View>
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
