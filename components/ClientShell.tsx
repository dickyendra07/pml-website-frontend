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

export default function ClientShell({ children, locale }: ClientShellProps) {
  const [proposalOpen, setProposalOpen] = useState(false);

  useEffect(() => {
    const openProposal = () => setProposalOpen(true);

    window.addEventListener("open-proposal-modal", openProposal);

    return () => {
      window.removeEventListener("open-proposal-modal", openProposal);
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
