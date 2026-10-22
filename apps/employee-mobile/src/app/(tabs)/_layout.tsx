import { NativeTabs } from "expo-router/native-tabs";
import { colors } from "../../components/ui";
export default function TabsLayout() {
  return (
    <NativeTabs tintColor={colors.primary} backgroundColor={colors.white}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="directory">
        <NativeTabs.Trigger.Label>Directory</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="leave">
        <NativeTabs.Trigger.Label>Leave</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
