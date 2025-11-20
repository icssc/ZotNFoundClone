"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

export function PostHogPageView(): null {
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
