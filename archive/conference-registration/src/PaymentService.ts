export type User = { attendeeId: string; voucherCategory: "speaker" | "guest" };
export class PaymentService {
  voucherFor(user: User) { return { id: `voucher-${user.attendeeId}`, amount: user.voucherCategory === "speaker" ? 0 : 15, unit: "event-credit" }; }
}
