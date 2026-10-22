import { useState } from "react";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useDataContext } from "../../data";
import {
  Badge,
  Card,
  Chips,
  Heading,
  Page,
  s,
  Status,
  money,
} from "../../components/ui";
export default function Orders() {
  const { orders } = useDataContext();
  const [status, setStatus] = useState("All orders");
  const statuses = [
    "All orders",
    ...new Set(orders.data?.map((o) => o.status) ?? []),
  ];
  const visible =
    orders.data?.filter(
      (o) => status === "All orders" || o.status === status,
    ) ?? [];
  return (
    <Page refreshing={orders.loading} onRefresh={orders.reload}>
      <Heading
        eyebrow="Your order history"
        title="A little more clarity."
        subtitle="Review the latest recorded status and total for each order."
      />
      <Chips
        label="Filter by status"
        values={statuses}
        value={status}
        onChange={setStatus}
      />
      <Status
        {...orders}
        retry={orders.reload}
        hasData={!!orders.data}
        empty={
          !visible.length
            ? orders.data?.length
              ? "No orders match this status."
              : "No orders are available for this customer yet."
            : undefined
        }
      />
      {visible.map((o) => (
        <Card
          key={o.id}
          label={`View order ${o.id}`}
          onPress={() => router.push(`/order/${encodeURIComponent(o.id)}`)}
        >
          <View style={s.between}>
            <Text style={s.name}>{o.id}</Text>
            <Badge label={o.status} />
          </View>
          <Text style={s.price}>{money(o.total_minor)}</Text>
          <Text style={s.small}>USD · View order details →</Text>
        </Card>
      ))}
      <Text style={s.footnote}>Showing orders for customer cus-001</Text>
    </Page>
  );
}
