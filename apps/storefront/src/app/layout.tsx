import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Equipment | Northstar",
  description: "Practical equipment for teams, desks, and the field.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
