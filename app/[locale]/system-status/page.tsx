import type { Metadata } from "next";

import SystemStatusClient from "./SystemStatusClient";

export const metadata: Metadata = {
  title: "System Status | Pharma Metric Labs",
  description:
    "General availability status for Pharma Metric Labs website and platform services.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SystemStatusPage() {
  return <SystemStatusClient />;
}
