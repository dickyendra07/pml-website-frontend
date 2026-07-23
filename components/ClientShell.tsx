"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ProposalModal from "./ProposalModal";

type ClientShellProps = {
  children: React.ReactNode;
};

export default function ClientShell({ children }: ClientShellProps) {
  const pathname = usePathname();
  const [proposalOpen, setProposalOpen] = useState(false);
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const openProposal = () => setProposalOpen(true);

    window.addEventListener("open-proposal-modal", openProposal);

    return () => {
      window.removeEventListener("open-proposal-modal", openProposal);
    };
  }, []);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header onOpenProposal={() => setProposalOpen(true)} />
      {children}
      <Footer />
      <ProposalModal open={proposalOpen} onClose={() => setProposalOpen(false)} />
    </>
  );
}
