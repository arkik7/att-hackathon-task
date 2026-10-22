import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export const colors = {
  primary: "#067ab4",
  accent: "#3aa5dc",
  ink: "#162d40",
  muted: "#5a7082",
  line: "#dce7ee",
  wash: "#f0f6fa",
  soft: "#e9f5fc",
  white: "#ffffff",
};
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value / 100,
  );
export const formatDate = (value: string) =>
  new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
export function useRemote<T>(url: string, customer?: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const request = useCallback(() => {
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    return fetch(url, {
      signal: next.signal,
      headers: customer ? { "x-demo-user-id": customer } : undefined,
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok)
          throw new Error(
            body.error ??
              body.detail ??
              (response.status === 404
                ? "This record could not be found."
                : "The service is unavailable. Please try again."),
          );
        if (!next.signal.aborted) {
          setData(body);
          setError("");
        }
      })
      .catch((e) => {
        if (!next.signal.aborted)
          setError(
            e instanceof Error ? e.message : "Unable to load this information.",
          );
      })
      .finally(() => {
        if (!next.signal.aborted) setLoading(false);
      });
  }, [url, customer]);
  const reload = useCallback(() => {
    setLoading(true);
    setError("");
    return request();
  }, [request]);
  useEffect(() => {
    void request();
    return () => controller.current?.abort();
  }, [request]);
  return { data, loading, error, reload };
}
export function Page({
  children,
  refreshing = false,
  onRefresh,
}: {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={s.screen}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        s.page,
        {
          paddingTop: Platform.OS === "ios" ? 22 : Math.max(22, insets.top),
          paddingBottom: Math.max(30, insets.bottom + 20),
        },
      ]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}
export function Heading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={s.heading}>
      <View style={s.brandRow}>
        <View style={s.logo}>
          <Text style={s.logoText}>N</Text>
        </View>
        <Text style={s.eyebrow}>{eyebrow}</Text>
      </View>
      <Text role="heading" style={s.title}>
        {title}
      </Text>
      <Text style={s.subtitle}>{subtitle}</Text>
    </View>
  );
}
export function Action({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        (pressed || disabled) && s.pressed,
      ]}
    >
      <Text style={[s.buttonText, secondary && s.secondaryText]}>{label}</Text>
    </Pressable>
  );
}
export function Card({
  children,
  onPress,
  label,
}: {
  children: ReactNode;
  onPress?: () => void;
  label?: string;
}) {
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [s.card, pressed && s.pressed]}
    >
      {children}
    </Pressable>
  ) : (
    <View style={s.card}>{children}</View>
  );
}
export function Badge({ label }: { label: string }) {
  return (
    <View style={s.badge}>
      <Text style={s.badgeText}>{label}</Text>
    </View>
  );
}
export function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={s.metric}>
      <Text style={s.metricValue}>{value}</Text>
      <Text style={s.small}>{label}</Text>
    </View>
  );
}
export function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.field}>
      <Text style={s.small}>{label}</Text>
      <Text selectable style={s.name}>
        {value}
      </Text>
    </View>
  );
}
export function Search({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
}) {
  return (
    <View style={s.field}>
      <Text style={s.small}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        placeholder={label}
        placeholderTextColor={colors.muted}
        style={s.input}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}
export function Chips({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={s.field}>
      <Text style={s.small}>{label}</Text>
      <View style={s.chips}>
        {values.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: item === value }}
            aria-selected={item === value}
            onPress={() => onChange(item)}
            style={({ pressed }) => [
              s.chip,
              item === value && s.chipActive,
              pressed && s.pressed,
            ]}
          >
            <Text style={[s.chipText, item === value && s.chipTextActive]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
export function Status({
  loading,
  error,
  retry,
  empty,
  hasData = false,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
  empty?: string;
  hasData?: boolean;
}) {
  return (
    <>
      {loading ? (
        <View style={s.loading}>
          <ActivityIndicator color={colors.primary} />
          <Text style={s.small}>{hasData ? "Refreshing…" : "Loading…"}</Text>
        </View>
      ) : null}
      {error ? (
        <View style={s.error}>
          <Text accessibilityRole="alert" style={s.errorText}>
            {error}
          </Text>
          {hasData ? (
            <Text style={s.small}>Showing the last loaded information.</Text>
          ) : null}
          <Action
            label="Try again"
            onPress={retry}
            secondary
            disabled={loading}
          />
        </View>
      ) : !loading && empty ? (
        <View style={s.empty}>
          <Text style={s.subtitle}>{empty}</Text>
        </View>
      ) : null}
    </>
  );
}
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.wash },
  page: {
    padding: 22,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    flexGrow: 1,
  },
  heading: { marginBottom: 24 },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: colors.white, fontSize: 20, fontWeight: "800" },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    flexShrink: 1,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -1.2,
    marginBottom: 12,
  },
  subtitle: { fontSize: 15, lineHeight: 24, color: colors.muted },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 22,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    gap: 8,
  },
  name: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: colors.ink,
    flexShrink: 1,
  },
  small: { color: colors.muted, fontSize: 12, lineHeight: 20 },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  metrics: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  metric: {
    flexGrow: 1,
    flexBasis: 125,
    borderWidth: 1,
    borderColor: colors.line,
    borderTopWidth: 3,
    borderTopColor: colors.accent,
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 14,
  },
  metricValue: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 28,
    letterSpacing: -1,
    marginBottom: 6,
  },
  badge: {
    backgroundColor: colors.soft,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    borderRadius: 20,
  },
  badgeText: { color: "#08628e", fontSize: 12, fontWeight: "600" },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  secondary: {
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryText: { color: colors.primary },
  pressed: { opacity: 0.65 },
  field: { gap: 8, marginVertical: 10 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#b8cbd8",
    borderRadius: 10,
    minHeight: 48,
    padding: 14,
    color: colors.ink,
    fontSize: 15,
  },
  chips: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: colors.white },
  loading: {
    padding: 18,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    padding: 18,
    borderWidth: 1,
    borderColor: "#f3ccd3",
    backgroundColor: "#fff1f3",
    borderRadius: 12,
    marginVertical: 12,
    gap: 10,
  },
  errorText: { color: "#98273c", lineHeight: 22 },
  empty: {
    padding: 24,
    backgroundColor: colors.soft,
    borderRadius: 12,
    marginVertical: 12,
  },
  price: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -1,
    marginVertical: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.soft,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: { color: colors.primary, fontSize: 17, fontWeight: "700" },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 24,
    marginBottom: 22,
    gap: 12,
  },
  heroTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: -0.8,
  },
  heroText: { fontSize: 14, lineHeight: 23, color: colors.white },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingVertical: 8,
  },
  tab: {
    minHeight: 54,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  tabActive: { backgroundColor: colors.soft },
  tabText: { fontSize: 12, fontWeight: "600", color: colors.muted },
  tabTextActive: { color: colors.primary },
  tabSymbol: { fontSize: 21, color: colors.primary },
  flex: { flex: 1 },
  footnote: {
    textAlign: "center",
    fontSize: 11,
    color: colors.muted,
    marginTop: 28,
    lineHeight: 20,
  },
});
