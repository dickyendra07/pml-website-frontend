import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FacilityDetailTemplate from "@/components/pages/FacilityDetailTemplate";
import { getFacilityByKey } from "@/data/facilities";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type VrGalleryPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: VrGalleryPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/facilities/vr-gallery`, {
    title: isIndonesian ? "Galeri VR Fasilitas" : "Facility VR Gallery",
    description: isIndonesian
      ? "Jelajahi lingkungan dan fasilitas Pharma Metric Labs melalui pengalaman tur VR interaktif untuk mendukung peninjauan fasilitas secara jarak jauh."
      : "Explore Pharma Metric Labs facilities through an interactive VR tour experience for remote facility review and sponsor introduction.",
  });
}

export default function VrGalleryPage() {
  const data = getFacilityByKey("vr-gallery");

  if (!data) {
    notFound();
  }

  return <FacilityDetailTemplate data={data} />;
}
