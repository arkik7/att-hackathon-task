import { usePathname } from "expo-router";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Text } from "react-native";
import { s } from "../../components/ui";
const items = [
  { name: "index", href: "/", label: "Home", symbol: "▦" },
  { name: "directory", href: "/directory", label: "Directory", symbol: "≡" },
  { name: "leave", href: "/leave", label: "Leave", symbol: "◎" },
] as const;
export default function WebTabs() {
  const pathname = usePathname();
  return (
    <Tabs style={s.flex}>
      <TabSlot style={s.flex} />
      <TabList style={s.tabBar}>
        {items.map((item) => (
          <TabTrigger
            key={item.name}
            name={item.name}
            href={item.href}
            accessibilityRole="tab"
            aria-selected={pathname === item.href}
            style={[s.tab, pathname === item.href && s.tabActive]}
          >
            <Text aria-hidden style={s.tabSymbol}>
              {item.symbol}
            </Text>
            <Text
              style={[s.tabText, pathname === item.href && s.tabTextActive]}
            >
              {item.label}
            </Text>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}
