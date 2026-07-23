export type FacilityKey =
  | "clinical-facilities"
  | "analytical-facilities"
  | "supporting-facilities"
  | "vr-gallery";

export type FacilityItem = {
  key: FacilityKey;
  title: string;
  eyebrow: string;
  href: string;
  summary: string;
  image: string;
  gallery: string[];
  points: string[];
};

export const facilities: FacilityItem[] = [
  {
    key: "clinical-facilities",
    title: "Clinical Facilities",
    eyebrow: "Clinical Study Support",
    href: "/facilities/clinical-facilities",
    summary:
      "Clinical facility support for controlled study activities, including expanded 70-bed capacity, screening and dosing areas, experienced clinical research staff, and 24-hour medical support.",
    image: "/images/pml/facilities/photos/pml-facility-photo-09.png",
    gallery: [
      "/images/pml/facilities/photos/pml-facility-photo-09.png",
      "/images/pml/facilities/photos/pml-facility-photo-05.png",
      "/images/pml/facilities/photos/pml-facility-photo-14.png",
      "/images/pml/facilities/photos/pml-facility-photo-08.png",
      "/images/pml/facilities/photos/pml-facility-photo-15.png",
      "/images/pml/facilities/photos/pml-facility-photo-16.png",
    ],
    points: [
      "70-bed clinical facility capacity",
      "Dedicated screening and dosing area",
      "Experienced clinical research staff",
      "24-hour medical support",
      "Healthy volunteer database support",
      "Ambulance support for study operations",
    ],
  },
  {
    key: "analytical-facilities",
    title: "Analytical Facilities",
    eyebrow: "Laboratory Capability",
    href: "/facilities/analytical-facilities",
    summary:
      "Analytical laboratory capability supported by instruments and workflows for bioanalysis, contract analysis, product testing, documentation, and regulatory-ready reporting.",
    image: "/images/pml/facilities/photos/pml-facility-photo-01.png",
    gallery: [
      "/images/pml/facilities/photos/pml-facility-photo-01.png",
      "/images/pml/facilities/photos/pml-facility-photo-17.png",
      "/images/pml/facilities/photos/pml-facility-photo-02.png",
      "/images/pml/facilities/photos/pml-facility-photo-04.png",
      "/images/pml/facilities/photos/pml-facility-photo-07.png",
      "/images/pml/facilities/photos/pml-facility-photo-10.png",
      "/images/pml/facilities/photos/pml-facility-photo-11.png",
      "/images/pml/facilities/photos/pml-facility-photo-12.png",
      "/images/pml/facilities/photos/pml-facility-photo-13.png",
      "/images/pml/facilities/photos/pml-facility-photo-20.png",
    ],
    points: [
      "LC-MS/MS analytical support",
      "GC-FID and GC-MS capability",
      "ICP-OES support",
      "HPLC analytical workflow",
      "Bioanalytical method support",
      "Laboratory documentation and reporting",
    ],
  },
  {
    key: "supporting-facilities",
    title: "Supporting Facilities",
    eyebrow: "Operational Support",
    href: "/facilities/supporting-facilities",
    summary:
      "Supporting facility infrastructure for reliable study and laboratory operations, including drug storage, archive room, sample handling, and study operation support.",
    image: "/images/pml/facilities/photos/pml-facility-photo-03.png",
    gallery: [
      "/images/pml/facilities/photos/pml-facility-photo-03.png",
      "/images/pml/facilities/photos/pml-facility-photo-18.png",
      "/images/pml/facilities/photos/pml-facility-photo-21.png",
      "/images/pml/facilities/photos/pml-facility-photo-22.png",
      "/images/pml/facilities/photos/pml-facility-photo-23.png",
    ],
    points: [
      "Drug storage room",
      "Archive room",
      "Sample receiving and handling support",
      "Study operation infrastructure",
      "Documentation workflow support",
      "Project coordination support",
    ],
  },
  {
    key: "vr-gallery",
    title: "VR Gallery",
    eyebrow: "Facility Experience",
    href: "/facilities/vr-gallery",
    summary:
      "Interactive facility experience that allows visitors and sponsors to explore PML facility visuals through the official VR tour gallery.",
    image: "/images/pml/facilities/photos/pml-facility-photo-17.png",
    gallery: [
      "/images/pml/facilities/photos/pml-facility-photo-17.png",
      "/images/pml/facilities/photos/pml-facility-photo-09.png",
      "/images/pml/facilities/photos/pml-facility-photo-03.png",
    ],
    points: [
      "Interactive VR facility tour",
      "Visual overview of PML environment",
      "External VR gallery access",
      "Useful for sponsor introduction",
      "Supports remote facility review",
      "Direct link to official VR experience",
    ],
  },
];

export function getFacilityByKey(key: FacilityKey) {
  return facilities.find((facility) => facility.key === key);
}
