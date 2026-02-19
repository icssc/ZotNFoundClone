"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, type JSX } from "react";
import { trackPageView } from "@/lib/analytics";

/**
 * Inner component that performs the page view tracking.
 * This uses navigation hooks and must be rendered within a Suspense
 * boundary per next/navigation requirements when using `useSearchParams`.
 */
function PostHogPageViewInner(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }

      // Determine page name from pathname
      let pageName = "home";
      if (pathname === "/") {
        pageName = "home";
      } else if (pathname.startsWith("/about")) {
        pageName = "about";
      } else {
        pageName = pathname.substring(1) || "home";
      }

      trackPageView(pageName, {
        url,
        pathname,
        search_params: searchParams?.toString() || "",
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogPageView(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <PostHogPageViewInner />
    </Suspense>
  );
}
