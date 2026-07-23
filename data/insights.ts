export type InsightCategory = "articles" | "news" | "publications" | "faq";

export type InsightItem = {
  slug: string;
  category: InsightCategory;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
};

export const insightCategories = [
  {
    label: "Articles",
    href: "/insight/articles",
    category: "articles" as const,
    description:
      "Educational content about CRO services, BA/BE study, clinical trials, and pharmaceutical development.",
  },
  {
    label: "News",
    href: "/insight/news",
    category: "news" as const,
    description:
      "Updates from Pharma Metric Labs, service activities, facility updates, and company announcements.",
  },
  {
    label: "Publications",
    href: "/insight/publications",
    category: "publications" as const,
    description:
      "Scientific, regulatory, and documentation-related references for sponsors and partners.",
  },
  {
    label: "FAQ",
    href: "/insight/faq",
    category: "faq" as const,
    description:
      "Common questions about PML services, inquiry preparation, study discussion, and regulatory support.",
  },
];

export const insights: InsightItem[] = [
  {
    slug: "understanding-babe-studies",
    category: "articles",
    title: "Understanding BA/BE Study for Pharmaceutical Development",
    excerpt:
      "A practical introduction to bioavailability and bioequivalence studies, including when sponsors need BA/BE support and what information should be prepared.",
    date: "2026-01-12",
    readTime: "5 min read",
    image: "/images/pml/services/babe-studies-hero.png",
    tags: ["BA/BE Study", "Pharmaceutical Development"],
  },
  {
    slug: "clinical-trial-support-indonesia",
    category: "articles",
    title: "Clinical Trial Support in Indonesia: What Sponsors Should Prepare",
    excerpt:
      "Key considerations for sponsors planning clinical research activities in Indonesia, from site feasibility to EC and regulatory coordination.",
    date: "2026-01-18",
    readTime: "6 min read",
    image: "/images/pml/services/clinical-trial-hero.png",
    tags: ["Clinical Trial", "Indonesia CRO"],
  },
  {
    slug: "contract-analysis-sample-preparation",
    category: "articles",
    title: "Contract Analysis Inquiry: Sample and Testing Information Checklist",
    excerpt:
      "A simple guide to help clients prepare sample type, testing parameters, timelines, and documentation needs before requesting analytical support.",
    date: "2026-01-24",
    readTime: "4 min read",
    image: "/images/pml/facilities-gallery/analytical-main.jpg",
    tags: ["Contract Analysis", "Laboratory Testing"],
  },
  {
    slug: "pml-facility-capability-update",
    category: "news",
    title: "PML Facility Capability Supports Clinical and Analytical Project Needs",
    excerpt:
      "PML continues to strengthen facility readiness across clinical, analytical, and supporting infrastructure for reliable CRO project delivery.",
    date: "2026-02-03",
    readTime: "3 min read",
    image: "/images/pml/facilities-gallery/clinical-main.jpg",
    tags: ["Facilities", "Company Update"],
  },
  {
    slug: "vr-gallery-facility-experience",
    category: "news",
    title: "Explore PML Facility Experience Through VR Gallery",
    excerpt:
      "Sponsors and partners can explore PML facility visuals through the official VR Gallery experience.",
    date: "2026-02-10",
    readTime: "2 min read",
    image: "/images/pml/facilities-gallery/analytical-lab-1.jpg",
    tags: ["VR Gallery", "Facilities"],
  },
  {
    slug: "regulatory-consultation-overview",
    category: "publications",
    title: "Regulatory Management Overview for Indonesian Product Registration",
    excerpt:
      "A reference overview of regulatory management topics including BPOM pathway discussion, ACTD documents, dossier gap analysis, and study requirements.",
    date: "2026-02-16",
    readTime: "7 min read",
    image: "/images/pml/services/clinical-trial-regulatory.png",
    tags: ["Regulatory Management", "BPOM"],
  },
];

export const insightFaqs = [
  {
    question: "What services does Pharma Metric Labs provide?",
    answer:
      "PML provides integrated CRO services including BA/BE study, clinical trial, contract analysis, and regulatory management for pharmaceutical and related industries.",
  },
  {
    question: "Can PML support both local and international sponsors?",
    answer:
      "Yes. PML supports local and overseas sponsors that require clinical, analytical, regulatory, and documentation support in Indonesia.",
  },
  {
    question: "What information should be prepared before requesting a proposal?",
    answer:
      "Sponsors can prepare company information, service interest, product or study background, timeline, regulatory context, and available documents.",
  },
  {
    question: "Does PML provide regulatory management?",
    answer:
      "Yes. PML provides regulatory management including BPOM-focused guidance, document review, dossier gap analysis, ACTD preparation, and submission readiness support.",
  },
  {
    question: "Can visitors explore PML facilities online?",
    answer:
      "Yes. Visitors can explore selected facility visuals through the VR Gallery and facility pages on the website.",
  },
];

export function getInsightsByCategory(category: InsightCategory) {
  return insights.filter((item) => item.category === category);
}
