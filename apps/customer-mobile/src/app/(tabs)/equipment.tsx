import { useState } from "react";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useDataContext } from "../../data";
import {
  Badge,
  Card,
  Heading,
  Page,
  s,
  Search,
  Status,
  money,
} from "../../components/ui";
export default function Equipment() {
  const { products } = useDataContext();
  const [query, setQuery] = useState("");
  const visible =
    products.data?.filter((p) =>
      `${p.name} ${p.sku}`.toLowerCase().includes(query.trim().toLowerCase()),
    ) ?? [];
  return (
    <Page refreshing={products.loading} onRefresh={products.reload}>
      <Heading
        eyebrow="The workday collection"
        title="Find your essentials."
        subtitle="Straightforward equipment, with prices and availability at a glance."
      />
      <Search label="Search equipment" value={query} onChange={setQuery} />
      <Status
        {...products}
        hasData={!!products.data}
        retry={products.reload}
        empty={
          !visible.length
            ? products.data?.length
              ? "No equipment matches your search."
              : "The catalog is empty. Check back soon."
            : undefined
        }
      />
      <Text style={s.small}>
        {products.data ? `${visible.length} products` : "Equipment catalog"}
      </Text>
      {visible.map((p) => (
        <Card
          key={p.sku}
          label={`View ${p.name}`}
          onPress={() => router.push(`/product/${encodeURIComponent(p.sku)}`)}
        >
          <View style={s.between}>
            <Text style={s.eyebrow}>{p.sku}</Text>
            <Badge label={p.stock_on_hand > 0 ? "In stock" : "Out of stock"} />
          </View>
          <Text style={s.name}>{p.name}</Text>
          <Text style={s.price}>{money(p.price_minor)}</Text>
          <View style={s.between}>
            <Text style={s.small}>{p.stock_on_hand} available</Text>
            <Text style={s.eyebrow}>View details →</Text>
          </View>
        </Card>
      ))}
    </Page>
  );
}
