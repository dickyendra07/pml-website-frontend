"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  ApiHealthResult,
  getApiConfigurationStatus,
  getApiHealth,
} from "@/lib/admin-api";

type PageStatus = "loading" | "success" | "error";

function formatUptime(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}

function ServiceCard({
  label,
  description,
  status,
  responseTimeMs,
}: {
  label: string;
  description: string;
  status: "ok" | "error";
  responseTimeMs: number;
}) {
  const healthy = status === "ok";

  return (
    <article className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black text-black">{label}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-black/50">
            {description}
          </p>
        </div>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
            healthy
              ? "border border-[#039147]/20 bg-[#eaf8f0] text-[#039147]"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {healthy ? "Operational" : "Unavailable"}
        </span>
      </div>

      <div className="mt-7 flex items-end justify-between border-t border-black/5 pt-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/35">
            Response Time
          </p>
          <p className="mt-2 text-2xl font-black text-black">
            {responseTimeMs.toFixed(2)}
            <span className="ml-1 text-sm text-black/40">ms</span>
          </p>
        </div>

        <div
          className={`h-4 w-4 rounded-full ${
            healthy
              ? "bg-[#039147] shadow-[0_0_0_8px_rgba(3,145,71,0.10)]"
              : "bg-red-500 shadow-[0_0_0_8px_rgba(239,68,68,0.10)]"
          }`}
        />
      </div>
    </article>
  );
}

export default function AdminHealthPage() {
  const apiConfiguration = useMemo(() => getApiConfigurationStatus(), []);
  const [health, setHealth] = useState<ApiHealthResult | null>(null);
  const [status, setStatus] = useState<PageStatus>("loading");
  const [message, setMessage] = useState("");
  const [clientCheckedAt, setClientCheckedAt] = useState<Date | null>(null);

  const loadHealth = useCallback(async () => {
    setStatus("loading");
    setMessage("");

    try {
      const result = await getApiHealth();

      setHealth(result);
      setClientCheckedAt(new Date());
      setStatus("success");
    } catch (error) {
      setHealth(null);
      setClientCheckedAt(new Date());
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to retrieve service health information."
      );
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHealth();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadHealth]);

  const overallHealthy = status === "success" && health?.status === "ok";

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Technical Readiness
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            System Health
          </h1>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-black/55">
            Monitor API availability, PostgreSQL connectivity, Redis
            connectivity, environment configuration, and backend uptime.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadHealth()}
          disabled={status === "loading"}
          className="w-fit rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Checking Services..." : "Refresh Health Check"}
        </button>
      </div>

      <section
        className={`mb-8 overflow-hidden rounded-[30px] border p-6 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-8 ${
          overallHealthy
            ? "border-[#039147]/10 bg-gradient-to-br from-[#eaf8f0] to-white"
            : status === "error"
              ? "border-red-100 bg-gradient-to-br from-red-50 to-white"
              : "border-black/5 bg-white"
        }`}
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-black/40">
              Overall Status
            </p>
            <h2 className="mt-3 text-3xl font-black text-black">
              {status === "loading"
                ? "Checking system services"
                : overallHealthy
                  ? "All monitored services are operational"
                  : "One or more services need attention"}
            </h2>

            {status === "error" ? (
              <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-red-700">
                {message}
              </p>
            ) : null}

            {clientCheckedAt ? (
              <p className="mt-4 text-xs font-bold text-black/45">
                Dashboard checked at {formatDate(clientCheckedAt.toISOString())}
              </p>
            ) : null}
          </div>

          <div
            className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-xl font-black ${
              status === "loading"
                ? "bg-black/5 text-black/35"
                : overallHealthy
                  ? "bg-[#039147] text-white shadow-[0_20px_60px_rgba(3,145,71,0.30)]"
                  : "bg-red-500 text-white shadow-[0_20px_60px_rgba(239,68,68,0.25)]"
            }`}
          >
            {status === "loading" ? "..." : overallHealthy ? "OK" : "!"}
          </div>
        </div>
      </section>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[26px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.07)]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
            API URL
          </p>
          <p
            className={`mt-3 text-lg font-black ${
              apiConfiguration.configured ? "text-[#039147]" : "text-red-600"
            }`}
          >
            {apiConfiguration.configured ? "Configured" : "Missing"}
          </p>
          <p className="mt-3 break-all text-xs font-semibold leading-6 text-black/45">
            {apiConfiguration.baseUrl || "NEXT_PUBLIC_API_URL is not available"}
          </p>
        </article>

        <article className="rounded-[26px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.07)]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
            Environment
          </p>
          <p className="mt-3 text-lg font-black capitalize text-black">
            {health?.environment || "Unknown"}
          </p>
          <p className="mt-3 text-xs font-semibold leading-6 text-black/45">
            Current backend runtime environment.
          </p>
        </article>

        <article className="rounded-[26px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.07)]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
            API Uptime
          </p>
          <p className="mt-3 text-lg font-black text-black">
            {health ? formatUptime(health.uptimeSeconds) : "Unavailable"}
          </p>
          <p className="mt-3 text-xs font-semibold leading-6 text-black/45">
            Time since the latest backend restart.
          </p>
        </article>

        <article className="rounded-[26px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.07)]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
            API Timestamp
          </p>
          <p className="mt-3 text-sm font-black leading-6 text-black">
            {health ? formatDate(health.timestamp) : "Unavailable"}
          </p>
          <p className="mt-3 text-xs font-semibold leading-6 text-black/45">
            Timestamp generated directly by the API.
          </p>
        </article>
      </div>

      {health ? (
        <section>
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
              Service Connectivity
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">
              Monitored Services
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ServiceCard
              label="NestJS API"
              description="Backend API process and health endpoint availability."
              status={health.checks.api.status}
              responseTimeMs={health.checks.api.responseTimeMs}
            />

            <ServiceCard
              label="PostgreSQL"
              description="Database connectivity verified using Prisma SELECT 1."
              status={health.checks.database.status}
              responseTimeMs={health.checks.database.responseTimeMs}
            />

            <ServiceCard
              label="Redis"
              description="Redis connectivity verified using a PING command."
              status={health.checks.redis.status}
              responseTimeMs={health.checks.redis.responseTimeMs}
            />
          </div>
        </section>
      ) : null}
    </AdminShell>
  );
}
