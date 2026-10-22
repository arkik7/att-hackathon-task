import { router } from "expo-router";
import { Text, View } from "react-native";
import { useDataContext } from "../../data";
import {
  Action,
  Card,
  Heading,
  Metric,
  Page,
  s,
  Status,
} from "../../components/ui";
export default function Home() {
  const { people, selectedId } = useDataContext();
  const selected = people.data?.find((p) => p.employee_id === selectedId);
  return (
    <Page refreshing={people.loading} onRefresh={people.reload}>
      <Heading
        eyebrow="Northstar People"
        title="Hello, colleague."
        subtitle="Find your people. Get a clearer view of the workday."
      />
      <View style={s.hero}>
        <Text style={s.heroTitle}>Good work starts with people.</Text>
        <Text style={s.heroText}>
          Explore the directory and find the right colleague for your next
          conversation.
        </Text>
        <Action
          secondary
          label="Open the directory →"
          onPress={() => router.push("/directory")}
        />
      </View>
      <View style={s.metrics}>
        <Metric label="Colleagues" value={people.data?.length ?? "—"} />
        <Metric
          label="Departments"
          value={
            people.data
              ? new Set(people.data.map((p) => p.department)).size
              : "—"
          }
        />
      </View>
      <Status {...people} retry={people.reload} hasData={!!people.data} />
      <Text role="heading" style={s.sectionTitle}>
        A little more connected
      </Text>
      <Card>
        <Text style={s.name}>People directory</Text>
        <Text style={s.subtitle}>
          Search by name, find a team, and view a colleague’s contact details.
        </Text>
        <Action
          secondary
          label="Find a colleague"
          onPress={() => router.push("/directory")}
        />
      </Card>
      <Card>
        <Text style={s.name}>Leave snapshots</Text>
        <Text style={s.subtitle}>
          {selected
            ? `View the latest available balance for ${selected.display_name}.`
            : "Choose a colleague to view their annual leave balance and snapshot date."}
        </Text>
        <Action
          secondary
          label="View leave snapshots"
          onPress={() => router.push("/leave")}
        />
      </Card>
      <Text style={s.footnote}>
        Northstar People · Synthetic demonstration data
      </Text>
    </Page>
  );
}
