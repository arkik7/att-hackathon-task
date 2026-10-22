import { NativeTabs } from "expo-router/native-tabs";
import { colors } from "../../components/ui";
export default function TabsLayout() {
  return (
    <NativeTabs tintColor={colors.primary} backgroundColor={colors.white}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="equipment">
        <NativeTabs.Trigger.Label>Equipment</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Label>Orders</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
