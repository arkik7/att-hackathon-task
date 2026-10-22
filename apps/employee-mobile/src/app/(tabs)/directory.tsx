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
  Search,
  Status,
} from "../../components/ui";
export default function Directory() {
  const { people, setSelectedId } = useDataContext();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All teams");
  const departments = [
    "All teams",
    ...new Set(people.data?.map((p) => p.department) ?? []),
  ];
  const visible =
    people.data?.filter(
      (p) =>
        `${p.display_name} ${p.work_email}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (department === "All teams" || p.department === department),
    ) ?? [];
  return (
    <Page refreshing={people.loading} onRefresh={people.reload}>
      <Heading
        eyebrow="Your people, connected"
        title="Meet the team."
        subtitle="Find a colleague and the details that matter."
      />
      <Search label="Search name or email" value={query} onChange={setQuery} />
      <Chips
        label="Department"
        values={departments}
        value={department}
        onChange={setDepartment}
      />
      <Status
        {...people}
        retry={people.reload}
        hasData={!!people.data}
        empty={
          !visible.length
            ? people.data?.length
              ? "No colleagues match your filters."
              : "The directory is empty."
            : undefined
        }
      />
      {visible.map((p) => (
        <Card
          key={p.employee_id}
          label={`View profile for ${p.display_name}`}
          onPress={() => {
            setSelectedId(p.employee_id);
            router.push(`/employee/${encodeURIComponent(p.employee_id)}`);
          }}
        >
          <View style={s.row}>
            <View style={s.avatar}>
              <Text style={s.initials}>
                {p.display_name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </Text>
            </View>
            <View style={s.flex}>
              <Text style={s.name}>{p.display_name}</Text>
              <Text style={s.small}>{p.work_email}</Text>
            </View>
          </View>
          <View style={s.between}>
            <Badge label={p.department} />
            <Text style={s.eyebrow}>View profile →</Text>
          </View>
        </Card>
      ))}
    </Page>
  );
}
