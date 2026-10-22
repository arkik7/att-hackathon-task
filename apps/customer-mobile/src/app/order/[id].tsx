import { router, Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { base, customer, type Order } from "../../data";
import {
  Action,
  Badge,
  Card,
  Field,
  Heading,
  Page,
  s,
  Status,
  money,
  useRemote,
} from "../../components/ui";
function OrderContent({ id }: { id: string }) {
  const resource = useRemote<Order>(
    `${base}/v1/orders/${encodeURIComponent(id)}`,
    customer,
  );
  const order = resource.data;
  return (
    <Page refreshing={resource.loading} onRefresh={resource.reload}>
      <Heading
        eyebrow="Order details"
        title={id}
        subtitle="The latest information recorded for this order."
      />
      <Status {...resource} retry={resource.reload} hasData={!!order} />
      {order ? (
        <Card>
          <Badge label={order.status} />
          <Text style={s.price}>{money(order.total_minor)} USD</Text>
          <Field label="Order reference" value={order.id} />
          <Field
            label="Charge reference"
            value={order.charge_id ?? "No charge recorded"}
          />
          {order.status === "declined" ? (
            <Text style={s.subtitle}>
              The demonstration payment was declined.
            </Text>
          ) : null}
          {order.items?.length ? (
            <>
              <Text role="heading" style={s.sectionTitle}>
                Items
              </Text>
              {order.items.map((item) => (
                <Field
                  key={item.sku}
                  label={item.sku}
                  value={`Quantity: ${item.quantity}`}
                />
              ))}
            </>
          ) : null}
        </Card>
      ) : null}
      <Action
        secondary
        label="Back to orders"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/orders")
        }
      />
    </Page>
  );
}
export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: "Order details" }} />
      <OrderContent key={id} id={id} />
    </>
  );
}
