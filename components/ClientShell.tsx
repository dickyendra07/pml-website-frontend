"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import Header from "./Header";
import Footer from "./Footer";
import ProposalModal from "./ProposalModal";

type ClientShellProps = {
  children: React.ReactNode;
  locale: Locale;
};

const PUBLIC_LOCALE_PATH = /^\/(en|id)(?:\/|$)/;

export default function ClientShell({ children, locale }: ClientShellProps) {
  const [proposalOpen, setProposalOpen] = useState(false);

  useEffect(() => {
    const openProposal = () => setProposalOpen(true);

    window.addEventListener("open-proposal-modal", openProposal);

    return () => {
      window.removeEventListener("open-proposal-modal", openProposal);
    };
  }, []);

  useEffect(() => {
    const handleDocumentNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target.toLowerCase() !== "_self")
      ) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href.startsWith("#")) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);

      if (
        destination.origin !== window.location.origin ||
        !PUBLIC_LOCALE_PATH.test(destination.pathname)
      ) {
        return;
      }

      const currentUrl = new URL(window.location.href);
      const isSameDocument =
        destination.pathname === currentUrl.pathname &&
        destination.search === currentUrl.search;

      if (isSameDocument) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      window.location.assign(destination.href);
    };

    document.addEventListener("click", handleDocumentNavigation, true);

    return () => {
      document.removeEventListener("click", handleDocumentNavigation, true);
    };
  }, []);

  return (
    <>
      <Header locale={locale} onOpenProposal={() => setProposalOpen(true)} />
      {children}
      <Footer locale={locale} />
      <ProposalModal
        locale={locale}
        open={proposalOpen}
        onClose={() => setProposalOpen(false)}
      />
    </>
  );
}
