import { router, Stack } from "expo-router";
import { Heading, Page, Action } from "../components/ui";
export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: "Page not found" }} />
      <Page>
        <Heading
          eyebrow="Northstar"
          title="Nothing here yet."
          subtitle="This page could not be found. Return home to keep exploring."
        />
        <Action label="Go home" onPress={() => router.replace("/")} />
      </Page>
    </>
  );
}
