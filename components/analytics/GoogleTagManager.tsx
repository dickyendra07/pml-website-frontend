"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

const GTM_ID = "GTM-MNT2NKMQ";

function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const pagePath = query ? `${pathname}?${query}` : pathname;
  const previousPagePath = useRef<string | null>(null);

  useEffect(() => {
    if (!/^\/(en|id)(?:\/|$)/.test(pathname)) {
      previousPagePath.current = pagePath;
      return;
    }

    if (previousPagePath.current === null) {
      previousPagePath.current = pagePath;
      return;
    }

    if (previousPagePath.current === pagePath) {
      return;
    }

    previousPagePath.current = pagePath;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
      page_language: document.documentElement.lang,
      page_locale: document.documentElement.dataset.locale,
    });
  }, [pagePath, pathname]);

  return null;
}

export default function GoogleTagManager() {
  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({
              'gtm.start': new Date().getTime(),
              event:'gtm.js'
            });
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),
            dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>

      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}
