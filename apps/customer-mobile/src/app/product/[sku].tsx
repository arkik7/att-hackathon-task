import { router, Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { useDataContext } from "../../data";
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
} from "../../components/ui";
export default function ProductDetail() {
  const { sku } = useLocalSearchParams<{ sku: string }>();
  const { products } = useDataContext();
  const product = products.data?.find((p) => p.sku === sku);
  return (
    <>
      <Stack.Screen options={{ title: "Equipment details" }} />
      <Page refreshing={products.loading} onRefresh={products.reload}>
        <Heading
          eyebrow="Workday essentials"
          title={product?.name ?? "Equipment details"}
          subtitle="The information you need, in one place."
        />
        <Status
          {...products}
          retry={products.reload}
          hasData={!!products.data}
          empty={
            !product
              ? "This product could not be found in the catalog."
              : undefined
          }
        />
        {product ? (
          <Card>
            <Badge
              label={product.stock_on_hand > 0 ? "In stock" : "Out of stock"}
            />
            <Text style={s.price}>{money(product.price_minor)} USD</Text>
            <Field label="Product reference" value={product.sku} />
            <Field
              label="Units available"
              value={String(product.stock_on_hand)}
            />
            <Text style={s.subtitle}>
              To place a demonstration order, use the Northstar storefront.
            </Text>
          </Card>
        ) : null}
        <Action
          secondary
          label="Back to equipment"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/equipment")
          }
        />
      </Page>
    </>
  );
}
