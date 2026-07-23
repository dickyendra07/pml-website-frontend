import type { Metadata } from "next";

import LegalPolicyLayout, {
  type LegalSection,
} from "@/components/pages/LegalPolicyLayout";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type CookiePolicyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const cookieSectionsEn: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    paragraphs: [
      "This Cookie Policy explains how Pharma Metric Labs uses cookies and similar technologies when you access this website.",
      "This policy should be read together with the Pharma Metric Labs Privacy Policy, which provides further information regarding the processing and protection of personal information.",
    ],
  },
  {
    id: "what-are-cookies",
    title: "2. What Are Cookies?",
    paragraphs: [
      "Cookies are small text files or data records that may be stored on your computer, mobile device, or browser when you visit a website.",
      "Cookies can help a website remember preferences, maintain security, support forms, measure performance, and improve the browsing experience.",
      "Similar technologies may include local storage, session storage, pixels, tags, scripts, and identifiers used by browsers or third-party services.",
    ],
  },
  {
    id: "why-used",
    title: "3. Why We Use Cookies",
    bullets: [
      "To provide essential website functionality and navigation.",
      "To maintain website security and prevent misuse.",
      "To remember cookie consent and other website preferences.",
      "To support contact, inquiry, proposal, and other website forms.",
      "To understand website traffic and page performance.",
      "To evaluate how visitors interact with website content.",
      "To improve website functionality, usability, and communication.",
      "To support embedded or third-party features such as maps and analytics.",
    ],
  },
  {
    id: "cookie-types",
    title: "4. Types of Cookies and Technologies",
    paragraphs: [
      "Depending on website configuration and the consent provided, the website may use the following categories.",
    ],
    bullets: [
      "Strictly necessary cookies: required for core website functionality, security, navigation, consent storage, and form operation.",
      "Preference or functional cookies: used to remember selected settings, language preferences, and user choices.",
      "Analytics cookies: used to understand visitor numbers, traffic sources, page use, and website performance.",
      "Third-party cookies: placed or accessed by external service providers whose features are used or embedded on the website.",
    ],
  },
  {
    id: "essential",
    title: "5. Strictly Necessary Cookies",
    paragraphs: [
      "Strictly necessary cookies and storage technologies are required for the website to function correctly. They may support navigation, security, session management, consent preferences, form submissions, and protection against misuse.",
      "Because these technologies are necessary for website operation, they may remain active even when optional cookies are rejected.",
    ],
  },
  {
    id: "functional",
    title: "6. Functional and Preference Cookies",
    paragraphs: [
      "Functional technologies may remember selected preferences and improve convenience during future visits.",
      "Disabling these technologies may cause certain preferences or website features to be unavailable or reset.",
    ],
  },
  {
    id: "analytics",
    title: "7. Analytics and Performance Cookies",
    paragraphs: [
      "Where enabled and permitted, analytics tools may collect aggregated information about website visits, page views, traffic sources, browser or device characteristics, and interaction patterns.",
      "This information is used to evaluate website performance and improve content or functionality. Analytics cookies should only be activated according to the applicable cookie preference and website configuration.",
    ],
  },
  {
    id: "third-party",
    title: "8. Third-Party Technologies",
    paragraphs: [
      "The website may include external services such as Google Maps, analytics tools, embedded content, social media links, email functionality, or other third-party features.",
      "These providers may place or access cookies and process information under their own terms and privacy policies. Pharma Metric Labs does not control cookies placed directly by independent third parties.",
    ],
  },
  {
    id: "duration",
    title: "9. Session and Persistent Cookies",
    bullets: [
      "Session cookies generally remain active only while the browser session is open and are removed after the browser is closed.",
      "Persistent cookies may remain on the device for a specified period or until they are manually deleted.",
      "The duration depends on the cookie’s purpose, website configuration, and the settings of the relevant provider.",
    ],
  },
  {
    id: "preferences",
    title: "10. Managing Cookie Preferences",
    paragraphs: [
      "You may accept or reject optional cookies through the cookie consent interface available on this website.",
      "Your selected preference may be stored in browser storage so the website can remember the choice. If browser data is cleared, the website may request your preference again.",
      "You can also manage or delete cookies through browser settings. Browser instructions vary depending on the browser and device used.",
    ],
  },
  {
    id: "consequences",
    title: "11. Consequences of Disabling Cookies",
    paragraphs: [
      "Rejecting optional cookies should not prevent access to core website content.",
      "Disabling strictly necessary cookies or browser storage through device settings may affect website navigation, consent storage, form operation, security, maps, embedded content, or other functionality.",
    ],
  },
  {
    id: "updates",
    title: "12. Updates to This Cookie Policy",
    paragraphs: [
      "Pharma Metric Labs may update this Cookie Policy to reflect changes in website functionality, technology, third-party services, regulatory requirements, or corporate policies.",
      "The latest version will be published on this page together with the most recent update date.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact Pharma Metric Labs",
    paragraphs: [
      "Questions regarding this Cookie Policy or the use of website technologies may be submitted through the Contact Us page.",
      "Email: info@pharmametriclabs.com",
      "Address: Gedung Indra Sentral Unit R & T, Jl. Let. Jend. Suprapto No. 60, Cempaka Putih, Central Jakarta 10520, Indonesia.",
    ],
  },
];

const cookieSectionsId: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Pendahuluan",
    paragraphs: [
      "Kebijakan Cookies ini menjelaskan bagaimana Pharma Metric Labs menggunakan cookies dan teknologi sejenis ketika Anda mengakses website.",
      "Kebijakan ini perlu dibaca bersama Kebijakan Privasi Pharma Metric Labs yang memberikan informasi lebih lanjut mengenai pemrosesan dan perlindungan informasi pribadi.",
    ],
  },
  {
    id: "what-are-cookies",
    title: "2. Apa Itu Cookies?",
    paragraphs: [
      "Cookies adalah file teks atau catatan data berukuran kecil yang dapat disimpan pada komputer, perangkat seluler, atau browser ketika Anda mengunjungi website.",
      "Cookies dapat membantu website mengingat preferensi, menjaga keamanan, mendukung formulir, mengukur performa, dan meningkatkan pengalaman penggunaan.",
      "Teknologi sejenis dapat mencakup local storage, session storage, pixel, tag, script, dan identifier yang digunakan oleh browser atau layanan pihak ketiga.",
    ],
  },
  {
    id: "why-used",
    title: "3. Alasan Kami Menggunakan Cookies",
    bullets: [
      "Menyediakan fungsi dan navigasi utama website.",
      "Menjaga keamanan website dan mencegah penyalahgunaan.",
      "Mengingat persetujuan cookies dan preferensi website.",
      "Mendukung formulir kontak, inquiry, proposal, dan formulir lainnya.",
      "Memahami lalu lintas serta performa halaman.",
      "Mengevaluasi interaksi pengunjung dengan konten website.",
      "Meningkatkan fungsi, kemudahan penggunaan, dan komunikasi website.",
      "Mendukung fitur pihak ketiga seperti peta dan analitik.",
    ],
  },
  {
    id: "cookie-types",
    title: "4. Jenis Cookies dan Teknologi",
    bullets: [
      "Cookies yang sangat diperlukan: dibutuhkan untuk fungsi utama, keamanan, navigasi, penyimpanan persetujuan, dan pengoperasian formulir.",
      "Cookies preferensi atau fungsional: digunakan untuk mengingat pengaturan, bahasa, dan pilihan pengguna.",
      "Cookies analitik: digunakan untuk memahami jumlah pengunjung, sumber lalu lintas, penggunaan halaman, dan performa website.",
      "Cookies pihak ketiga: ditempatkan atau diakses oleh penyedia eksternal yang fiturnya digunakan atau disematkan pada website.",
    ],
  },
  {
    id: "essential",
    title: "5. Cookies yang Sangat Diperlukan",
    paragraphs: [
      "Cookies dan teknologi penyimpanan yang sangat diperlukan membantu website berfungsi secara benar. Teknologi ini dapat mendukung navigasi, keamanan, pengelolaan sesi, preferensi persetujuan, formulir, dan perlindungan terhadap penyalahgunaan.",
      "Karena diperlukan untuk pengoperasian website, teknologi ini dapat tetap aktif meskipun cookies opsional ditolak.",
    ],
  },
  {
    id: "functional",
    title: "6. Cookies Fungsional dan Preferensi",
    paragraphs: [
      "Teknologi fungsional dapat mengingat preferensi tertentu dan memberikan kenyamanan pada kunjungan berikutnya.",
      "Menonaktifkan teknologi ini dapat menyebabkan beberapa preferensi atau fitur website tidak tersedia atau kembali ke pengaturan awal.",
    ],
  },
  {
    id: "analytics",
    title: "7. Cookies Analitik dan Performa",
    paragraphs: [
      "Apabila diaktifkan dan diizinkan, alat analitik dapat mengumpulkan informasi agregat mengenai kunjungan, tampilan halaman, sumber lalu lintas, karakteristik browser atau perangkat, dan pola interaksi.",
      "Informasi ini digunakan untuk mengevaluasi performa website serta meningkatkan konten atau fungsi. Cookies analitik hanya seharusnya diaktifkan berdasarkan preferensi cookies dan konfigurasi website yang berlaku.",
    ],
  },
  {
    id: "third-party",
    title: "8. Teknologi Pihak Ketiga",
    paragraphs: [
      "Website dapat memuat layanan eksternal seperti Google Maps, alat analitik, konten tertanam, tautan media sosial, fungsi email, atau fitur pihak ketiga lainnya.",
      "Penyedia tersebut dapat menempatkan atau mengakses cookies serta memproses informasi berdasarkan ketentuan dan kebijakan privasi mereka. Pharma Metric Labs tidak mengendalikan cookies yang ditempatkan langsung oleh pihak ketiga independen.",
    ],
  },
  {
    id: "duration",
    title: "9. Session Cookies dan Persistent Cookies",
    bullets: [
      "Session cookies umumnya aktif selama sesi browser berlangsung dan dihapus setelah browser ditutup.",
      "Persistent cookies dapat tersimpan pada perangkat selama periode tertentu atau sampai dihapus secara manual.",
      "Durasi bergantung pada tujuan cookies, konfigurasi website, dan pengaturan penyedia terkait.",
    ],
  },
  {
    id: "preferences",
    title: "10. Mengelola Preferensi Cookies",
    paragraphs: [
      "Anda dapat menerima atau menolak cookies opsional melalui tampilan persetujuan cookies pada website.",
      "Preferensi dapat disimpan di browser agar website mengingat pilihan tersebut. Apabila data browser dihapus, website dapat meminta pilihan kembali.",
      "Anda juga dapat mengelola atau menghapus cookies melalui pengaturan browser. Petunjuk dapat berbeda sesuai browser dan perangkat yang digunakan.",
    ],
  },
  {
    id: "consequences",
    title: "11. Dampak Menonaktifkan Cookies",
    paragraphs: [
      "Penolakan cookies opsional seharusnya tidak menghalangi akses terhadap konten utama website.",
      "Menonaktifkan cookies atau penyimpanan browser yang sangat diperlukan melalui pengaturan perangkat dapat memengaruhi navigasi, penyimpanan persetujuan, formulir, keamanan, peta, konten tertanam, atau fungsi lainnya.",
    ],
  },
  {
    id: "updates",
    title: "12. Perubahan Kebijakan Cookies",
    paragraphs: [
      "Pharma Metric Labs dapat memperbarui Kebijakan Cookies ini untuk menyesuaikan perubahan fungsi website, teknologi, layanan pihak ketiga, ketentuan regulasi, atau kebijakan perusahaan.",
      "Versi terbaru akan dipublikasikan pada halaman ini bersama tanggal pembaruan terakhir.",
    ],
  },
  {
    id: "contact",
    title: "13. Hubungi Pharma Metric Labs",
    paragraphs: [
      "Pertanyaan mengenai Kebijakan Cookies atau penggunaan teknologi website dapat dikirim melalui halaman Hubungi Kami.",
      "Email: info@pharmametriclabs.com",
      "Alamat: Gedung Indra Sentral Unit R & T, Jl. Let. Jend. Suprapto No. 60, Cempaka Putih, Jakarta Pusat 10520, Indonesia.",
    ],
  },
];

export async function generateMetadata({
  params,
}: CookiePolicyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";
  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/cookie-policy`, {
    title: isIndonesian ? "Kebijakan Cookies" : "Cookie Policy",
    description: isIndonesian
      ? "Kebijakan Cookies Pharma Metric Labs mengenai penggunaan cookies, analitik, teknologi pihak ketiga, dan pengelolaan preferensi."
      : "Pharma Metric Labs Cookie Policy regarding cookies, analytics, third-party technologies, and preference management.",
  });
}

export default async function CookiePolicyPage({
  params,
}: CookiePolicyPageProps) {
  const resolvedParams = await params;
  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";
  const isIndonesian = locale === "id";

  return (
    <LegalPolicyLayout
      locale={locale}
      eyebrow={isIndonesian ? "Kebijakan Website" : "Website Policy"}
      title={isIndonesian ? "Kebijakan Cookies" : "Cookie Policy"}
      description={
        isIndonesian
          ? "Kebijakan ini menjelaskan penggunaan cookies dan teknologi sejenis pada website Pharma Metric Labs."
          : "This policy explains the use of cookies and similar technologies on the Pharma Metric Labs website."
      }
      lastUpdatedLabel={isIndonesian ? "Terakhir diperbarui" : "Last updated"}
      lastUpdatedValue={isIndonesian ? "Juli 2026" : "July 2026"}
      tableOfContentsLabel={isIndonesian ? "Daftar Isi" : "Table of Contents"}
      sections={isIndonesian ? cookieSectionsId : cookieSectionsEn}
      relatedTitle={
        isIndonesian ? "Perlindungan Data Pribadi" : "Personal Data Protection"
      }
      relatedDescription={
        isIndonesian
          ? "Pelajari bagaimana Pharma Metric Labs mengelola dan melindungi informasi melalui Kebijakan Privasi."
          : "Learn how Pharma Metric Labs manages and protects information through its Privacy Policy."
      }
      relatedHref="/privacy-policy"
      relatedLabel={
        isIndonesian ? "Lihat Kebijakan Privasi" : "View Privacy Policy"
      }
    />
  );
}
