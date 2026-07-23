export type ServiceKey =
  | "contract-analysis"
  | "babe"
  | "clinical-trial"
  | "regulatory-consultation";

export type ServiceItem = {
  key: ServiceKey;
  title: string;
  href: string;
  summary: string;
  icon: string;
  image: string;
};

export const services: ServiceItem[] = [
  {
    key: "contract-analysis",
    title: "Contract Analysis",
    href: "/services/contract-analysis",
    summary:
      "Reliable analytical testing support for product quality, safety, compliance, and documentation needs",
    icon: "/images/pml/icons/icon-contract-analysis.svg",
    image: "/images/pml/services/contract-analysis-hero.png",
  },
  {
    key: "babe",
    title: "BA/BE Study",
    href: "/services/babe-studies",
    summary:
      "End-to-end bioavailability and bioequivalence study support from clinical conduct and bioanalysis to regulatory-ready reporting",
    icon: "/images/pml/icons/icon-babe.svg",
    image: "/images/pml/services/babe-studies-hero.png",
  },
  {
    key: "clinical-trial",
    title: "Clinical Trial",
    href: "/services/clinical-trial",
    summary:
      "Clinical research support across study planning, regulatory coordination, site management, monitoring, and medical writing",
    icon: "/images/pml/icons/icon-clinical-trial.svg",
    image: "/images/pml/services/clinical-trial-hero.png",
  },
  {
    key: "regulatory-consultation",
    title: "Regulatory Management",
    href: "/services/regulatory-consultation",
    summary:
      "Regulatory management support for product registration, ACTD documents, compliance, and submission readiness",
    icon: "/images/pml/icons/icon-regulatory-consultation.svg",
    image: "/images/pml/services/contract-analysis-proof.png",
  },
];

export function getOtherServices(current?: ServiceKey | null) {
  return services.filter((service) => service.key !== current);
}
