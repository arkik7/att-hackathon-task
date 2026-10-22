import { router } from "expo-router";
import { Text, View } from "react-native";
import { useDataContext } from "../../data";
import {
  Action,
  Badge,
  Card,
  Heading,
  Metric,
  Page,
  s,
  Status,
  money,
} from "../../components/ui";
export default function Home() {
  const { products, orders } = useDataContext();
  const recent = orders.data?.slice(0, 3) ?? [];
  return (
    <Page
      refreshing={products.loading || orders.loading}
      onRefresh={() => {
        void products.reload();
        void orders.reload();
      }}
    >
      <Heading
        eyebrow="Northstar Equipment"
        title="Ready for your workday."
        subtitle="Find your essentials and keep an eye on your orders."
      />
      <View style={s.hero}>
        <Text style={s.heroTitle}>Good tools. Clear purpose.</Text>
        <Text style={s.heroText}>
          Practical equipment for your desk, your team, and wherever the day
          takes you.
        </Text>
        <Action
          secondary
          label="Explore equipment →"
          onPress={() => router.push("/equipment")}
        />
      </View>
      <View style={s.metrics}>
        <Metric label="Catalog products" value={products.data?.length ?? "—"} />
        <Metric label="Your orders" value={orders.data?.length ?? "—"} />
      </View>
      <Status {...products} retry={products.reload} hasData={!!products.data} />
      <Text role="heading" style={s.sectionTitle}>
        Recent orders
      </Text>
      <Status
        {...orders}
        retry={orders.reload}
        hasData={!!orders.data}
        empty={
          !recent.length
            ? "Your orders will appear here once they’re available."
            : undefined
        }
      />
      {recent.map((order) => (
        <Card
          key={order.id}
          label={`View order ${order.id}`}
          onPress={() => router.push(`/order/${encodeURIComponent(order.id)}`)}
        >
          <View style={s.between}>
            <Text style={s.name}>{order.id}</Text>
            <Badge label={order.status} />
          </View>
          <Text style={s.small}>
            {money(order.total_minor)} USD · View details →
          </Text>
        </Card>
      ))}
      <Action
        secondary
        label="View all orders"
        onPress={() => router.push("/orders")}
      />
      <Text style={s.footnote}>
        Northstar Equipment · Customer cus-001{"\n"}Synthetic demonstration data
      </Text>
    </Page>
  );
}
