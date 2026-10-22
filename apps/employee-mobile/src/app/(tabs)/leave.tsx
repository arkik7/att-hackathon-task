import { useState } from "react";
import { Text } from "react-native";
import { base, useDataContext, type Employee, type Leave } from "../../data";
import {
  Card,
  Chips,
  Field,
  Heading,
  Page,
  s,
  Status,
  formatDate,
  useRemote,
} from "../../components/ui";
function Snapshot({ employee }: { employee: Employee }) {
  const leave = useRemote<Leave>(
    `${base}/v1/employees/${encodeURIComponent(employee.employee_id)}/leave`,
  );
  return (
    <>
      <Status {...leave} retry={leave.reload} hasData={!!leave.data} />
      {leave.data ? (
        <Card>
          <Text style={s.eyebrow}>Annual leave · {employee.display_name}</Text>
          <Text style={s.price}>{leave.data.annual_days_remaining} days</Text>
          <Text style={s.subtitle}>Annual leave remaining</Text>
          <Field
            label="Snapshot date"
            value={formatDate(leave.data.snapshot_date)}
          />
          <Text style={s.small}>
            This is the latest available directory snapshot for the selected
            colleague.
          </Text>
        </Card>
      ) : null}
    </>
  );
}
export default function LeaveScreen() {
  const [snapshotVersion, setSnapshotVersion] = useState(0);
  const { people, selectedId, setSelectedId } = useDataContext();
  const selected = people.data?.find((p) => p.employee_id === selectedId);
  return (
    <Page
      refreshing={people.loading}
      onRefresh={() => {
        void people.reload();
        setSnapshotVersion((v) => v + 1);
      }}
    >
      <Heading
        eyebrow="People snapshots"
        title="A little room to recharge."
        subtitle="Choose a colleague to view their annual leave snapshot."
      />
      <Status
        {...people}
        retry={people.reload}
        hasData={!!people.data}
        empty={
          !people.data?.length
            ? "No colleagues are available to select."
            : undefined
        }
      />
      {people.data?.length ? (
        <Chips
          label="Selected colleague"
          values={people.data.map((p) => p.display_name)}
          value={selected?.display_name ?? ""}
          onChange={(name) =>
            setSelectedId(
              people.data?.find((p) => p.display_name === name)?.employee_id ??
                null,
            )
          }
        />
      ) : null}
      {selected ? (
        <Snapshot
          key={`${selected.employee_id}-${snapshotVersion}`}
          employee={selected}
        />
      ) : (
        <Card>
          <Text style={s.subtitle}>
            Select a name above to view their annual leave balance and snapshot
            date.
          </Text>
        </Card>
      )}
    </Page>
  );
}
