export const demoIdentityHeader = "x-demo-user-id";
export const defaultCustomerId = "cus-001";
export type DemoIdentity = { customerId: string };
export function readDemoIdentity(
  value: string | string[] | undefined,
): DemoIdentity {
  return {
    customerId:
      typeof value === "string" && /^cus-\d{3}$/.test(value)
        ? value
        : defaultCustomerId,
  };
}
