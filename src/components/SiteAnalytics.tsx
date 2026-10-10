"use client";

// Vercel Web Analytics, minus my own visits. Open any page with ?me once in a browser
// and that browser stops being counted; ?me=off counts it again. The flag lives in
// localStorage, so it holds per browser and per device until site data is cleared.

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

const OWNER_KEY = "va-owner";

function beforeSend(event: BeforeSendEvent) {
  try {
    const me = new URL(event.url).searchParams.get("me");
    if (me === "off") localStorage.removeItem(OWNER_KEY);
    else if (me !== null) localStorage.setItem(OWNER_KEY, "1");
    if (localStorage.getItem(OWNER_KEY)) return null;
  } catch {
    // Storage blocked: count the visit rather than lose it
  }
  return event;
}

export default function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
