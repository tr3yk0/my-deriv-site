"use client";

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart3, LayoutDashboard, Maximize2, ShieldCheck, Sparkles, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export type DesktopWrapperTheme = "dark" | "light" | "system";

export interface DesktopWrapperProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  brandName?: string;
  brandAccent?: string;
  theme?: DesktopWrapperTheme;
  /** Minimum width in px to be considered desktop. Defaults to 1024 */
  desktopMinWidth?: number;
  /** Hide the desktop gate and render children regardless of viewport. */
  forceDesktop?: boolean;
  /** Optional custom message shown on non-desktop devices. */
  mobileTitle?: string;
  mobileDescription?: string;
  /** Optional action area rendered inside the header. */
  actions?: ReactNode;
  /** Optional sidebar content */
  sidebar?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  /** Enable the polished shell chrome around the app area. Defaults to true. */
  shell?: boolean;
}

function useIsDesktop(minWidth: number) {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setIsDesktop(mediaQuery.matches);

    update();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, [minWidth]);

  return isDesktop;
}

function DesktopOnlyNotice({
  title,
  description,
  brandName,
}: {
  title: string;
  description: string;
  brandName: string;
}) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#070b14] text-white">
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-4xl items-center justify-center px-6 py-10">
        <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            <WifiOff className="h-4 w-4" />
            Desktop required
          </div>
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.24em] text-white/50 uppercase">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                {brandName}
              </div>
              <h1 className="max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/70 md:text-lg">{description}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Advanced charting</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Risk controls</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Automation-ready</span>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <FeatureCard icon={<LayoutDashboard className="h-5 w-5" />} title="Workspace" description="A focused trading workspace designed for larger screens." />
                <FeatureCard icon={<BarChart3 className="h-5 w-5" />} title="Market tools" description="Room for indicators, order flow, and contract details." />
                <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Secure flow" description="Clear boundaries for execution, review, and monitoring." />
                <FeatureCard icon={<Maximize2 className="h-5 w-5" />} title="Full canvas" description="Better visibility across charts, panels, and bot controls." />
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-white/50">
            <AlertTriangle className="h-4 w-4 text-amber-300" />
            This experience is optimized for desktop screen sizes.
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/90">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-white/60">{description}</p>
    </div>
  );
}

export default function DesktopWrapper({
  children,
  className,
  contentClassName,
  headerTitle = "Trading Workspace",
  headerSubtitle = "Professional execution environment",
  brandName = "FXBotHub",
  brandAccent = "from-emerald-400 via-cyan-400 to-blue-500",
  theme = "dark",
  desktopMinWidth = 1024,
  forceDesktop = false,
  mobileTitle = "A desktop browser is required",
  mobileDescription = "This platform is built for wide screens so charts, bots, and execution tools remain clear and usable.",
  actions,
  sidebar,
  footer,
  shell = true,
}: DesktopWrapperProps) {
  const isDesktop = useIsDesktop(desktopMinWidth);
  const shouldRenderDesktop = forceDesktop || isDesktop;

  const themeClasses = useMemo(() => {
    if (theme === "light") {
      return "bg-[#f6f8fc] text-slate-900";
    }
    return "bg-[#050814] text-white";
  }, [theme]);

  if (!shouldRenderDesktop) {
    return <DesktopOnlyNotice title={mobileTitle} description={mobileDescription} brandName={brandName} />;
  }

  return (
    <div className={cn("min-h-[100dvh] overflow-hidden", themeClasses, className)}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={cn("absolute inset-0 opacity-100", theme === "light"
          ? "[background-image:linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:48px_48px]"
          : "[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]")} />
        <div className={cn("absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl", theme === "light" ? "bg-cyan-200/40" : "bg-cyan-500/10")} />
        <div className={cn("absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl", theme === "light" ? "bg-emerald-200/30" : "bg-emerald-500/10")} />
      </div>

      <div className={cn("relative mx-auto flex min-h-[100dvh] w-full max-w-[1920px] flex-col", shell ? "p-4 lg:p-6" : "p-0")}>
        <div className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border shadow-2xl backdrop-blur-xl",
          theme === "light"
            ? "border-slate-200/70 bg-white/80 shadow-slate-900/5"
            : "border-white/10 bg-white/[0.04] shadow-black/30"
        )}>
          <header className={cn(
            "flex items-center justify-between gap-4 border-b px-5 py-4 lg:px-6",
            theme === "light" ? "border-slate-200/80" : "border-white/10"
          )}>
            <div className="flex min-w-0 items-center gap-4">
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", brandAccent)}>
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-base font-semibold tracking-tight lg:text-lg">{brandName}</h1>
                  <span className={cn(
                    "hidden rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.22em] lg:inline-flex",
                    theme === "light" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700" : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  )}>
                    Desktop
                  </span>
                </div>
                <p className={cn("truncate text-sm", theme === "light" ? "text-slate-600" : "text-white/60")}>
                  {headerTitle} • {headerSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {actions}
            </div>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className={cn(
              "hidden min-h-0 border-r px-4 py-5 lg:block",
              theme === "light" ? "border-slate-200/80 bg-slate-50/70" : "border-white/10 bg-black/10"
            )}>
              <div className="flex h-full min-h-0 flex-col gap-4">
                <div className={cn("rounded-2xl border p-4", theme === "light" ? "border-slate-200 bg-white" : "border-white/10 bg-white/[0.03]") }>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <LayoutDashboard className="h-4 w-4" />
                    Navigation
                  </div>
                  <div className={cn("space-y-2 text-sm", theme === "light" ? "text-slate-600" : "text-white/65")}>
                    <SidebarItem active label="Dashboard" />
                    <SidebarItem label="Bots" />
                    <SidebarItem label="Analytics" />
                    <SidebarItem label="Orders" />
                    <SidebarItem label="Risk & Settings" />
                  </div>
                </div>

                <div className={cn("rounded-2xl border p-4", theme === "light" ? "border-slate-200 bg-white" : "border-white/10 bg-white/[0.03]") }>
                  <div className="mb-3 text-sm font-medium">Status</div>
                  <div className="space-y-3 text-sm">
                    <StatusRow label="Connection" value="Stable" tone="ok" />
                    <StatusRow label="Latency" value="Low" tone="ok" />
                    <StatusRow label="Mode" value="Live / Demo" tone="info" />
                    <StatusRow label="Protection" value="Enabled" tone="ok" />
                  </div>
                </div>

                {sidebar ? (
                  <div className={cn("min-h-0 flex-1 overflow-auto rounded-2xl border p-4", theme === "light" ? "border-slate-200 bg-white" : "border-white/10 bg-white/[0.03]") }>
                    {sidebar}
                  </div>
                ) : null}
              </div>
            </aside>

            <main className={cn("min-h-0 overflow-auto", contentClassName)}>
              <div className="flex min-h-full flex-col">
                <div className={cn(
                  "border-b px-5 py-4 lg:px-6",
                  theme === "light" ? "border-slate-200/80" : "border-white/10"
                )}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className={cn("text-sm font-medium uppercase tracking-[0.24em]", theme === "light" ? "text-slate-500" : "text-white/45")}>Live workspace</div>
                      <h2 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">{headerTitle}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                        theme === "light" ? "border-slate-200 bg-slate-50 text-slate-700" : "border-white/10 bg-white/5 text-white/75"
                      )}>
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        Protected execution area
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 px-5 py-5 lg:px-6 lg:py-6">
                  <div
                    className={cn(
                      "rounded-[24px] border p-4 lg:p-6",
                      theme === "light" ? "border-slate-200 bg-white shadow-sm" : "border-white/10 bg-black/15 shadow-black/20"
                    )}
                  >
                    {children}
                  </div>
                </div>

                {footer ? (
                  <footer className={cn(
                    "border-t px-5 py-4 lg:px-6",
                    theme === "light" ? "border-slate-200/80 text-slate-500" : "border-white/10 text-white/50"
                  )}>
                    {footer}
                  </footer>
                ) : null}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 transition-colors",
        active ? "bg-emerald-500/10 text-emerald-400" : "text-inherit hover:bg-black/5 hover:text-inherit"
      )}
    >
      <span className={cn("h-2.5 w-2.5 rounded-full", active ? "bg-emerald-400" : "bg-current opacity-30")} />
      <span>{label}</span>
    </div>
  );
}

function StatusRow({
  label,
  value,
  tone = "info",
}: {
  label: string;
  value: string;
  tone?: "ok" | "info" | "warn";
}) {
  const toneClass =
    tone === "ok"
      ? "text-emerald-400"
      : tone === "warn"
        ? "text-amber-400"
        : "text-sky-400";

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-inherit opacity-70">{label}</span>
      <span className={cn("text-sm font-medium", toneClass)}>{value}</span>
    </div>
  );
}
