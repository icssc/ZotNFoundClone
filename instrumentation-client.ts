if (typeof window !== "undefined") {
  const init = () => {
    void import("posthog-js").then((posthog) => {
      posthog.default.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        defaults: "2025-05-24",
        capture_exceptions: true,
        debug: false,
      });
    });
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(init);
  } else {
    setTimeout(init, 200);
  }
}
