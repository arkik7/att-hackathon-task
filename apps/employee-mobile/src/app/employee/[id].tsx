import { router, Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { base, useDataContext, type Employee, type Leave } from "../../data";
import {
  Action,
  Badge,
  Card,
  Field,
  Heading,
  Page,
  s,
  Status,
  formatDate,
  useRemote,
} from "../../components/ui";
function Profile({ id }: { id: string }) {
  const employee = useRemote<Employee>(
    `${base}/v1/employees/${encodeURIComponent(id)}`,
  );
  const leave = useRemote<Leave>(
    `${base}/v1/employees/${encodeURIComponent(id)}/leave`,
  );
  const { setSelectedId } = useDataContext();
  const person = employee.data;
  return (
    <Page
      refreshing={employee.loading || leave.loading}
      onRefresh={() => {
        void employee.reload();
        void leave.reload();
      }}
    >
      <Heading
        eyebrow="Colleague profile"
        title={person?.display_name ?? "Colleague details"}
        subtitle={
          person?.department ?? "Contact details and the latest leave snapshot."
        }
      />
      <Status {...employee} retry={employee.reload} hasData={!!person} />
      {person ? (
        <>
          <Card>
            <Badge label={person.department} />
            <Field label="Work email" value={person.work_email} />
            <Field label="Employee reference" value={person.employee_id} />
            {person.employment_status ? (
              <Field
                label="Employment status"
                value={person.employment_status}
              />
            ) : null}
          </Card>
          <Text role="heading" style={s.sectionTitle}>
            Leave snapshot
          </Text>
          <Status {...leave} retry={leave.reload} hasData={!!leave.data} />
          {leave.data ? (
            <Card>
              <Text style={s.price}>
                {leave.data.annual_days_remaining} days
              </Text>
              <Text style={s.subtitle}>Annual leave remaining</Text>
              <Field
                label="As of"
                value={formatDate(leave.data.snapshot_date)}
              />
            </Card>
          ) : null}
          <Action
            label="View in Leave"
            onPress={() => {
              setSelectedId(id);
              router.replace("/leave");
            }}
          />
        </>
      ) : null}
      <Action
        secondary
        label="Back to directory"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/directory")
        }
      />
    </Page>
  );
}
export default function EmployeeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: "Colleague profile" }} />
      <Profile key={id} id={id} />
    </>
  );
}
