import { ServiceKey } from "./services";

export type ServicePageData = {
  key: ServiceKey;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  overviewTitle: string;
  overview: string;
  scope: string[];
  benefits: string[];
  workflow: string[];
  faq: [string, string][];
};

export const servicePages: Record<ServiceKey, ServicePageData> = {
  babe: {
    key: "babe",
    eyebrow: "BA/BE Study",
    title: "End-to-end BA/BE study support with scientific reliability",
    description:
      "PML supports bioavailability and bioequivalence studies from clinical conduct and sample handling to bioanalysis, documentation, and regulatory-ready reporting.",
    image: "/images/pml/services/babe-studies-hero.png",
    overviewTitle: "Bioequivalence study support for pharmaceutical sponsors",
    overview:
      "PML supports sponsors and pharmaceutical companies with integrated BA/BE study services designed to help demonstrate product equivalence through structured clinical and analytical workflows.",
    scope: [
      "BA/BE study planning and coordination",
      "Clinical conduct and volunteer coordination",
      "Sample collection and sample handling",
      "Bioanalytical laboratory support",
      "Study documentation and reporting",
      "Regulatory-ready output support",
    ],
    benefits: [
      "Integrated support from clinical conduct to reporting",
      "Experienced team for local and international sponsors",
      "Structured workflow for reliable study execution",
      "Documentation prepared for regulatory review",
    ],
    workflow: [
      "Initial project discussion and requirement review",
      "Study planning and document preparation",
      "Clinical execution and sample handling",
      "Bioanalysis and quality review",
      "Reporting and completion support",
    ],
    faq: [
      ["Who needs BA/BE study support?", "Pharmaceutical companies, generic manufacturers, and sponsors that need to demonstrate bioequivalence for product registration or regulatory submission."],
      ["Can PML support local and international sponsors?", "Yes. PML supports both local and overseas sponsors for BA/BE project requirements."],
      ["What information is needed to start?", "Sponsors can prepare product information, study objective, regulatory context, timeline, and available documentation."],
    ],
  },
  "clinical-trial": {
    key: "clinical-trial",
    eyebrow: "Clinical Trial",
    title: "End-to-end clinical trial support with local expertise",
    description:
      "PML supports sponsors with clinical research services across study planning, regulatory coordination, site management, monitoring, data management, and medical writing.",
    image: "/images/pml/services/clinical-trial-hero.png",
    overviewTitle: "Clinical research execution support for sponsors",
    overview:
      "PML supports clinical research needs through structured operational support, regulatory coordination, site activities, study monitoring, and documentation workflows.",
    scope: [
      "Clinical trial agreement and project planning",
      "EC and regulatory submission support",
      "Study intervention coordination",
      "Site management and monitoring",
      "Data management support",
      "Medical writing and close-out documentation",
    ],
    benefits: [
      "Local clinical research expertise",
      "Structured coordination from planning to close-out",
      "Support across documentation and operational workflow",
      "Responsive sponsor communication",
    ],
    workflow: [
      "Project planning and feasibility discussion",
      "Document preparation and submission support",
      "Study setup and site coordination",
      "Monitoring and project execution",
      "Study close-out and reporting support",
    ],
    faq: [
      ["What clinical trial does PML provide?", "PML supports study planning, regulatory coordination, site management, monitoring, data management, and medical writing."],
      ["Can PML assist with EC and regulatory submission?", "Yes. PML can support coordination and documentation for EC and regulatory submission workflows."],
      ["Who can use this service?", "Pharmaceutical companies, biotech companies, medical device companies, and sponsors requiring local clinical research execution support."],
    ],
  },
  "contract-analysis": {
    key: "contract-analysis",
    eyebrow: "Contract Analysis",
    title: "Reliable contract analysis support for product quality and compliance",
    description:
      "PML provides analytical testing support for pharmaceutical and related products, helping sponsors meet quality, safety, compliance, and documentation needs.",
    image: "/images/pml/services/contract-analysis-hero.png",
    overviewTitle: "Analytical testing support for sponsor projects",
    overview:
      "PML supports contract analysis needs for pharmaceutical, medical device, biotechnology, food and beverage, cosmetic, and related companies requiring reliable laboratory testing and documentation.",
    scope: [
      "Sample analysis and testing support",
      "Method-based analytical work",
      "Urgent analysis service for selected parameters",
      "Sample pick-up coordination for selected locations",
      "Laboratory documentation and reporting",
      "Project discussion and testing requirement review",
    ],
    benefits: [
      "Reliable laboratory testing support",
      "Clear documentation for project and compliance needs",
      "Support for multiple sponsor categories",
      "Responsive coordination for sample and timeline requirements",
    ],
    workflow: [
      "Initial testing requirement discussion",
      "Sample and parameter review",
      "Quotation and timeline confirmation",
      "Laboratory analysis",
      "Report preparation and delivery",
    ],
    faq: [
      ["Does PML provide sample pick-up services?", "Yes. PML provides sample pick-up services, and selected locations may be eligible for complimentary pick-up."],
      ["Is urgent analysis service available?", "Yes. Urgent analysis may be available for selected testing parameters and projects depending on laboratory capacity and sample requirements."],
      ["What information is needed to request analysis?", "Clients should provide sample type, testing parameters, quantity, timeline, and project context."],
    ],
  },
  "regulatory-consultation": {
    key: "regulatory-consultation",
    eyebrow: "Regulatory Management",
    title: "Regulatory affairs support for BPOM registration and compliance",
    description:
      "PML supports pharmaceutical, biologics, advanced therapy, traditional and quasi-drug, and medical device registration through practical regulatory strategy and documentation review.",
    image: "/images/pml/services/contract-analysis-proof.png",
    overviewTitle: "Regulatory support for product registration in Indonesia",
    overview:
      "PML’s Regulatory Affairs team helps companies navigate BPOM requirements through practical regulatory management, documentation review, and submission preparation support.",
    scope: [
      "New product registration",
      "Variations and post-approval changes",
      "Dossier gap analysis",
      "Preparation of ACTD documents",
      "Regulatory strategy consultation",
      "BE study and clinical trial consultation",
      "Halal compliance support",
      "Importation and licensing support",
      "Clinical and non-clinical document review",
    ],
    benefits: [
      "One-stop support for regulatory management and documentation",
      "Understanding of Indonesian regulatory requirements",
      "Coordination with relevant stakeholders and regulatory bodies",
      "Up-to-date knowledge of current regulations and trends",
    ],
    workflow: [
      "Initial product and regulatory pathway review",
      "Dossier gap analysis and strategy discussion",
      "Document preparation or review",
      "Submission readiness support",
      "Follow-up consultation and regulatory coordination",
    ],
    faq: [
      ["Do you only support companies based in Indonesia?", "No. PML also works with overseas principals and manufacturers to support product registration in Indonesia."],
      ["Do overseas companies need a local agent?", "Yes. Foreign manufacturers are generally required to appoint a local company in Indonesia as Marketing Authorization Holder or local agent for BPOM registration and communication."],
      ["Can overseas approvals support Indonesian registration?", "Previous approvals from other regulatory authorities may support the registration process, but products must still comply with BPOM requirements and local standards."],
      ["Is a local clinical trial or BE study required?", "The requirement depends on product category, regulatory pathway, existing evidence, and country of origin. PML can help evaluate the appropriate strategy."],
    ],
  },
};
