export type MediaVariantKey =
  | "hero"
  | "card"
  | "thumbnail"
  | "3-4"
  | "1-1";


export type MediaVariantInfo = {
  title: string;
  description: string;
  usage: string;
  recommendedFor: string[];
};


export const mediaVariantConfig: Record<
  MediaVariantKey,
  MediaVariantInfo
> = {

  hero: {
    title: "Hero Banner",
    description:
      "Large optimized image for main visual sections.",
    usage:
      "Homepage Hero, Landing Page, Main Banner",
    recommendedFor: [
      "Homepage",
      "Service Landing",
      "Campaign Page",
    ],
  },


  card: {
    title: "Content Card",
    description:
      "Balanced image format for content listing.",
    usage:
      "Insight Article, Catalogue, News Listing",
    recommendedFor: [
      "Insight",
      "Catalogue",
      "Content Section",
    ],
  },


  thumbnail: {
    title: "Thumbnail",
    description:
      "Small preview image optimized for compact display.",
    usage:
      "Search Result, Preview, Small Component",
    recommendedFor: [
      "Admin Preview",
      "Search",
      "Related Content",
    ],
  },


  "3-4": {
    title: "Portrait Image",
    description:
      "Vertical composition for portrait layouts.",
    usage:
      "Mobile Section, Profile Layout",
    recommendedFor: [
      "Mobile Content",
      "Portrait Section",
    ],
  },


  "1-1": {
    title: "Square Image",
    description:
      "Square composition suitable for balanced layouts.",
    usage:
      "Social, Profile, Compact Card",
    recommendedFor: [
      "Social Media",
      "Profile",
      "Square Card",
    ],
  },

};


export function getMediaVariantInfo(
  key: string,
): MediaVariantInfo {

  return (
    mediaVariantConfig[key as MediaVariantKey] || {
      title: key,
      description:
        "Generated media variant.",
      usage:
        "General usage",
      recommendedFor: [],
    }
  );

}
