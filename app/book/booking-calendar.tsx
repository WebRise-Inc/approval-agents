"use client";

import Script from "next/script";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./book.module.css";

type CalCommand = (...args: unknown[]) => void;
type CalApi = CalCommand & {
  ns: Record<string, CalCommand>;
  config: { forwardQueryParams?: boolean };
};

declare global {
  interface Window { Cal?: CalApi }
}

// Cal's standard queue loader lets initialization run before its remote script loads.
const calLoader = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");`;

export default function BookingCalendar() {
  const initialized = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [bookingUrl, setBookingUrl] = useState("https://cal.com/approvalagents/15min");
  const onReady = useCallback(() => setStatus("ready"), []);
  const onFailure = useCallback(() => setStatus("failed"), []);

  useEffect(() => {
    setBookingUrl(`https://cal.com/approvalagents/15min${window.location.search}`);
    // A direct booking link stays available even when third-party scripts are blocked.
    const timeout = window.setTimeout(() => {
      setStatus((current) => current === "loading" ? "failed" : current);
    }, 25000);
    return () => {
      window.clearTimeout(timeout);
      const booking = window.Cal?.ns?.["15min"];
      booking?.("off", { action: "linkReady", callback: onReady });
      booking?.("off", { action: "linkFailed", callback: onFailure });
    };
  }, [onReady, onFailure]);

  function initializeCalendar() {
    const cal = window.Cal;
    if (!cal || initialized.current || !document.getElementById("my-cal-inline-15min")) return;
    initialized.current = true;

    cal("init", "15min", { origin: "https://app.cal.com" });
    cal.config = cal.config || {};
    cal.config.forwardQueryParams = true;

    const booking = cal.ns["15min"];
    booking("on", { action: "linkReady", callback: onReady });
    booking("on", { action: "linkFailed", callback: onFailure });
    booking("inline", {
      elementOrSelector: "#my-cal-inline-15min",
      calLink: "approvalagents/15min",
      config: {
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
        theme: "light",
        iframeAttrs: { title: "Book a free consultation with Approval Agents" },
      },
    });
    booking("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
      theme: "light",
      cssVarsPerTheme: { light: { "cal-brand": "#2e50fe" } },
    });
  }

  return (
    <div className={styles.calendarWrap}>
      <div className={styles.calendarFrame}>
        <div className={styles.calendar} id="my-cal-inline-15min" />
        {status !== "ready" && (
          <div className={styles.calendarLoading} role="status">
            {status === "loading" ? (
              <span>Loading available times…</span>
            ) : (
              <div>
                <p>The calendar is taking a little longer to load.</p>
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer">Choose a time on Cal.com <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
            )}
          </div>
        )}
      </div>

      <p className={styles.calendarHelp}>
        Prefer a separate window?
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer">Open the booking page <ArrowUpRight size={14} aria-hidden="true" /></a>
      </p>

      <Script id="approval-agents-cal-loader" strategy="afterInteractive" onReady={() => queueMicrotask(initializeCalendar)} onError={onFailure}>
        {calLoader}
      </Script>
    </div>
  );
}
