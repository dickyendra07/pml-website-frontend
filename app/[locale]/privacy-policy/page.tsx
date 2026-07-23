import type { Metadata } from "next";

import LegalPolicyLayout, {
  type LegalSection,
} from "@/components/pages/LegalPolicyLayout";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type PrivacyPolicyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const privacySectionsEn: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction and Scope",
    paragraphs: [
      "Pharma Metric Labs respects the privacy of website visitors, prospective clients, sponsors, business partners, job applicants, and other individuals who interact with this website.",
      "This Privacy Policy explains how information may be collected, used, stored, disclosed, and protected when you access the Pharma Metric Labs website or submit information through its available features.",
      "This policy applies to information processed through this website. Separate agreements, study documents, clinical research documentation, contracts, or other service-specific notices may contain additional data protection provisions.",
    ],
  },
  {
    id: "information-collected",
    title: "2. Information We May Collect",
    paragraphs: [
      "We may collect information that you provide voluntarily and technical information generated when you use this website.",
    ],
    bullets: [
      "Identification information, including your name and professional title.",
      "Contact information, including email address, telephone number, country, and business address.",
      "Company, institution, sponsor, or organizational information.",
      "Information submitted through contact, inquiry, proposal, and catalogue request forms.",
      "Service interests, study background, project requirements, expected timelines, and supporting messages.",
      "Career application information, including curriculum vitae, portfolio, qualifications, experience, and supporting documents.",
      "Technical information such as IP address, browser type, device type, operating system, referral source, access time, and website interaction data.",
      "Any other information that you voluntarily provide to Pharma Metric Labs.",
    ],
  },
  {
    id: "collection-methods",
    title: "3. How Information Is Collected",
    bullets: [
      "Directly from you when you complete a website form, send an email, submit an inquiry, request a proposal, or apply for a position.",
      "Automatically through cookies, browser storage, server logs, analytics tools, and similar technologies.",
      "From authorized representatives, business partners, sponsors, or organizations when permitted and relevant to a legitimate business interaction.",
      "Through third-party services embedded in or linked from this website, subject to the policies of those providers.",
    ],
  },
  {
    id: "purposes",
    title: "4. Purposes of Processing",
    paragraphs: [
      "Pharma Metric Labs may process information for legitimate operational, communication, security, recruitment, and business purposes.",
    ],
    bullets: [
      "Responding to inquiries and communicating with prospective clients, sponsors, and business partners.",
      "Evaluating service requirements and preparing proposals or project discussions.",
      "Providing requested information, catalogues, documents, or website resources.",
      "Managing recruitment activities and assessing employment applications.",
      "Operating, maintaining, securing, and improving this website.",
      "Understanding website performance and visitor interaction.",
      "Maintaining business records and communication history.",
      "Preventing misuse, fraud, unauthorized access, and security incidents.",
      "Meeting applicable legal, regulatory, compliance, audit, or corporate governance requirements.",
    ],
  },
  {
    id: "legal-basis",
    title: "5. Basis for Processing",
    paragraphs: [
      "Depending on the nature of the interaction and applicable requirements, information may be processed based on consent, steps requested before entering into a business relationship, contractual necessity, legitimate business interests, legal obligations, or other lawful grounds.",
      "Where processing is based on consent, you may withdraw that consent subject to applicable requirements and without affecting processing already carried out.",
    ],
  },
  {
    id: "sharing",
    title: "6. Disclosure and Sharing of Information",
    paragraphs: [
      "Pharma Metric Labs does not sell personal information.",
      "Information may be disclosed only when reasonably necessary for website operation, business communication, recruitment, service delivery, security, compliance, or legal requirements.",
    ],
    bullets: [
      "Authorized employees, departments, and representatives of Pharma Metric Labs.",
      "Affiliated entities or relevant corporate functions where necessary and permitted.",
      "Website hosting, infrastructure, email, analytics, security, and technology service providers.",
      "Professional advisers, auditors, consultants, or legal representatives.",
      "Government authorities, regulators, courts, or law enforcement bodies when required by law or an authorized request.",
      "Other parties where you have provided consent or instructed Pharma Metric Labs to do so.",
    ],
  },
  {
    id: "third-party-services",
    title: "7. Third-Party Services and External Links",
    paragraphs: [
      "This website may use or provide links to third-party services such as Google Maps, analytics platforms, email services, recruitment links, or other external websites.",
      "Third-party services may collect or process information according to their own privacy policies. Pharma Metric Labs is not responsible for the privacy practices or content of websites that it does not control.",
    ],
  },
  {
    id: "retention",
    title: "8. Data Retention",
    paragraphs: [
      "Information will be retained only for as long as reasonably necessary for the purposes for which it was collected, including communication, proposal preparation, recruitment, recordkeeping, security, compliance, dispute resolution, and applicable legal or regulatory obligations.",
      "Retention periods may vary depending on the type of information, the nature of the relationship, and applicable requirements.",
    ],
  },
  {
    id: "security",
    title: "9. Information Security",
    paragraphs: [
      "Pharma Metric Labs applies reasonable administrative, organizational, and technical safeguards designed to protect information against unauthorized access, disclosure, alteration, misuse, loss, or destruction.",
      "However, no website, electronic transmission, or digital storage system can be guaranteed to be completely secure. Visitors should exercise care when transmitting confidential or sensitive information online.",
    ],
  },
  {
    id: "rights",
    title: "10. Your Rights and Choices",
    paragraphs: [
      "Subject to applicable requirements, you may request information about the processing of your personal data or exercise available rights.",
    ],
    bullets: [
      "Request access to personal data associated with you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion or restriction where legally available.",
      "Object to or withdraw consent for certain processing activities.",
      "Request information regarding data use or disclosure.",
      "Manage cookie preferences through the available cookie controls or browser settings.",
    ],
  },
  {
    id: "children",
    title: "11. Children’s Privacy",
    paragraphs: [
      "This website is intended for professional, corporate, research, healthcare, and business-related audiences. It is not intentionally designed to collect personal information from children.",
      "Where Pharma Metric Labs becomes aware that information from a child has been submitted without appropriate authorization, reasonable steps may be taken to remove it.",
    ],
  },
  {
    id: "updates",
    title: "12. Updates to This Privacy Policy",
    paragraphs: [
      "Pharma Metric Labs may revise this Privacy Policy to reflect changes in website functionality, operational practices, technology, legal requirements, or corporate policies.",
      "The most recent version will be published on this page together with its latest update date.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact Pharma Metric Labs",
    paragraphs: [
      "Questions, requests, or concerns regarding this Privacy Policy or the handling of information through this website may be submitted through the Contact Us page.",
      "Email: info@pharmametriclabs.com",
      "Address: Gedung Indra Sentral Unit R & T, Jl. Let. Jend. Suprapto No. 60, Cempaka Putih, Central Jakarta 10520, Indonesia.",
    ],
  },
];

const privacySectionsId: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Pendahuluan dan Ruang Lingkup",
    paragraphs: [
      "Pharma Metric Labs menghormati privasi pengunjung website, calon klien, sponsor, mitra bisnis, pelamar kerja, dan pihak lain yang berinteraksi dengan website ini.",
      "Kebijakan Privasi ini menjelaskan bagaimana informasi dapat dikumpulkan, digunakan, disimpan, dibagikan, dan dilindungi ketika Anda mengakses website Pharma Metric Labs atau mengirimkan informasi melalui fitur yang tersedia.",
      "Kebijakan ini berlaku untuk informasi yang diproses melalui website. Perjanjian, dokumen studi, dokumentasi penelitian klinis, kontrak, atau pemberitahuan khusus layanan dapat memuat ketentuan perlindungan data tambahan.",
    ],
  },
  {
    id: "information-collected",
    title: "2. Informasi yang Dapat Kami Kumpulkan",
    paragraphs: [
      "Kami dapat mengumpulkan informasi yang Anda berikan secara sukarela serta informasi teknis yang dihasilkan ketika Anda menggunakan website.",
    ],
    bullets: [
      "Informasi identitas, termasuk nama dan jabatan profesional.",
      "Informasi kontak, termasuk alamat email, nomor telepon, negara, dan alamat bisnis.",
      "Informasi perusahaan, institusi, sponsor, atau organisasi.",
      "Informasi yang dikirim melalui formulir kontak, inquiry, proposal, dan permintaan katalog.",
      "Layanan yang diminati, latar belakang studi, kebutuhan proyek, jadwal, dan pesan pendukung.",
      "Informasi lamaran kerja, termasuk CV, portofolio, kualifikasi, pengalaman, dan dokumen pendukung.",
      "Informasi teknis seperti alamat IP, jenis browser, perangkat, sistem operasi, sumber rujukan, waktu akses, dan interaksi dengan website.",
      "Informasi lain yang secara sukarela Anda sampaikan kepada Pharma Metric Labs.",
    ],
  },
  {
    id: "collection-methods",
    title: "3. Cara Kami Mengumpulkan Informasi",
    bullets: [
      "Secara langsung ketika Anda mengisi formulir, mengirim email, mengajukan inquiry, meminta proposal, atau melamar pekerjaan.",
      "Secara otomatis melalui cookies, penyimpanan browser, server log, alat analitik, dan teknologi sejenis.",
      "Dari perwakilan resmi, mitra bisnis, sponsor, atau organisasi jika diizinkan dan relevan dengan interaksi bisnis.",
      "Melalui layanan pihak ketiga yang disematkan atau ditautkan pada website, sesuai kebijakan penyedia layanan tersebut.",
    ],
  },
  {
    id: "purposes",
    title: "4. Tujuan Pemrosesan Informasi",
    bullets: [
      "Menanggapi inquiry serta berkomunikasi dengan calon klien, sponsor, dan mitra bisnis.",
      "Mengevaluasi kebutuhan layanan serta menyiapkan proposal atau diskusi proyek.",
      "Memberikan informasi, katalog, dokumen, atau sumber daya yang diminta.",
      "Mengelola proses rekrutmen dan mengevaluasi lamaran pekerjaan.",
      "Mengoperasikan, memelihara, mengamankan, dan meningkatkan website.",
      "Memahami performa website dan interaksi pengunjung.",
      "Memelihara catatan bisnis dan riwayat komunikasi.",
      "Mencegah penyalahgunaan, penipuan, akses tanpa izin, dan insiden keamanan.",
      "Memenuhi kewajiban hukum, regulasi, kepatuhan, audit, dan tata kelola perusahaan.",
    ],
  },
  {
    id: "legal-basis",
    title: "5. Dasar Pemrosesan",
    paragraphs: [
      "Bergantung pada bentuk interaksi dan ketentuan yang berlaku, informasi dapat diproses berdasarkan persetujuan, langkah sebelum dimulainya hubungan bisnis, kebutuhan kontraktual, kepentingan bisnis yang sah, kewajiban hukum, atau dasar lain yang diperbolehkan.",
      "Apabila pemrosesan didasarkan pada persetujuan, Anda dapat menarik persetujuan tersebut sesuai ketentuan yang berlaku tanpa memengaruhi pemrosesan yang telah dilakukan.",
    ],
  },
  {
    id: "sharing",
    title: "6. Pengungkapan dan Pembagian Informasi",
    paragraphs: [
      "Pharma Metric Labs tidak menjual informasi pribadi.",
      "Informasi hanya dapat dibagikan apabila secara wajar diperlukan untuk operasional website, komunikasi bisnis, rekrutmen, layanan, keamanan, kepatuhan, atau kewajiban hukum.",
    ],
    bullets: [
      "Karyawan, departemen, dan perwakilan resmi Pharma Metric Labs.",
      "Entitas terafiliasi atau fungsi korporat yang relevan apabila diperlukan dan diperbolehkan.",
      "Penyedia hosting, infrastruktur, email, analitik, keamanan, dan layanan teknologi.",
      "Penasihat profesional, auditor, konsultan, atau perwakilan hukum.",
      "Instansi pemerintah, regulator, pengadilan, atau penegak hukum apabila diwajibkan.",
      "Pihak lain berdasarkan persetujuan atau instruksi Anda.",
    ],
  },
  {
    id: "third-party-services",
    title: "7. Layanan Pihak Ketiga dan Tautan Eksternal",
    paragraphs: [
      "Website dapat menggunakan atau menyediakan tautan ke layanan pihak ketiga seperti Google Maps, platform analitik, layanan email, tautan rekrutmen, atau website eksternal lainnya.",
      "Layanan pihak ketiga dapat mengumpulkan atau memproses informasi berdasarkan kebijakan privasi mereka sendiri. Pharma Metric Labs tidak bertanggung jawab atas praktik privasi atau konten website yang tidak berada dalam kendalinya.",
    ],
  },
  {
    id: "retention",
    title: "8. Penyimpanan Data",
    paragraphs: [
      "Informasi disimpan hanya selama secara wajar diperlukan untuk tujuan pengumpulan, termasuk komunikasi, penyusunan proposal, rekrutmen, pencatatan, keamanan, kepatuhan, penyelesaian sengketa, serta kewajiban hukum atau regulasi.",
      "Masa penyimpanan dapat berbeda berdasarkan jenis informasi, hubungan dengan pengguna, dan ketentuan yang berlaku.",
    ],
  },
  {
    id: "security",
    title: "9. Keamanan Informasi",
    paragraphs: [
      "Pharma Metric Labs menerapkan langkah administratif, organisasi, dan teknis yang wajar untuk melindungi informasi dari akses, pengungkapan, perubahan, penyalahgunaan, kehilangan, atau pemusnahan tanpa izin.",
      "Namun, tidak ada website, transmisi elektronik, atau sistem penyimpanan digital yang dapat dijamin sepenuhnya aman. Pengunjung perlu berhati-hati ketika mengirimkan informasi rahasia atau sensitif secara daring.",
    ],
  },
  {
    id: "rights",
    title: "10. Hak dan Pilihan Anda",
    bullets: [
      "Meminta akses terhadap data pribadi yang berkaitan dengan Anda.",
      "Meminta koreksi informasi yang tidak akurat atau tidak lengkap.",
      "Meminta penghapusan atau pembatasan apabila diperbolehkan.",
      "Mengajukan keberatan atau menarik persetujuan untuk pemrosesan tertentu.",
      "Meminta informasi mengenai penggunaan atau pengungkapan data.",
      "Mengatur preferensi cookies melalui kontrol cookies atau pengaturan browser.",
    ],
  },
  {
    id: "children",
    title: "11. Privasi Anak",
    paragraphs: [
      "Website ini ditujukan untuk audiens profesional, korporat, penelitian, kesehatan, dan bisnis. Website tidak dirancang untuk secara sengaja mengumpulkan informasi pribadi anak.",
      "Apabila Pharma Metric Labs mengetahui adanya informasi anak yang dikirim tanpa izin yang sesuai, langkah yang wajar dapat dilakukan untuk menghapus informasi tersebut.",
    ],
  },
  {
    id: "updates",
    title: "12. Perubahan Kebijakan Privasi",
    paragraphs: [
      "Pharma Metric Labs dapat memperbarui Kebijakan Privasi ini untuk menyesuaikan perubahan fitur website, praktik operasional, teknologi, ketentuan hukum, atau kebijakan perusahaan.",
      "Versi terbaru akan dipublikasikan pada halaman ini bersama tanggal pembaruan terakhir.",
    ],
  },
  {
    id: "contact",
    title: "13. Hubungi Pharma Metric Labs",
    paragraphs: [
      "Pertanyaan, permintaan, atau kekhawatiran mengenai Kebijakan Privasi maupun pengelolaan informasi melalui website dapat dikirim melalui halaman Hubungi Kami.",
      "Email: info@pharmametriclabs.com",
      "Alamat: Gedung Indra Sentral Unit R & T, Jl. Let. Jend. Suprapto No. 60, Cempaka Putih, Jakarta Pusat 10520, Indonesia.",
    ],
  },
];

export async function generateMetadata({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";
  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/privacy-policy`, {
    title: isIndonesian ? "Kebijakan Privasi" : "Privacy Policy",
    description: isIndonesian
      ? "Kebijakan Privasi website Pharma Metric Labs mengenai pengumpulan, penggunaan, penyimpanan, perlindungan, dan hak atas data pribadi."
      : "Pharma Metric Labs website Privacy Policy regarding the collection, use, retention, protection, and rights associated with personal information.",
  });
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const resolvedParams = await params;
  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";
  const isIndonesian = locale === "id";

  return (
    <LegalPolicyLayout
      locale={locale}
      eyebrow={isIndonesian ? "Kebijakan Website" : "Website Policy"}
      title={isIndonesian ? "Kebijakan Privasi" : "Privacy Policy"}
      description={
        isIndonesian
          ? "Kebijakan ini menjelaskan bagaimana Pharma Metric Labs mengelola dan melindungi informasi yang disampaikan melalui website."
          : "This policy explains how Pharma Metric Labs manages and protects information submitted through this website."
      }
      lastUpdatedLabel={isIndonesian ? "Terakhir diperbarui" : "Last updated"}
      lastUpdatedValue={isIndonesian ? "Juli 2026" : "July 2026"}
      tableOfContentsLabel={isIndonesian ? "Daftar Isi" : "Table of Contents"}
      sections={isIndonesian ? privacySectionsId : privacySectionsEn}
      relatedTitle={isIndonesian ? "Informasi Cookies" : "Cookie Information"}
      relatedDescription={
        isIndonesian
          ? "Pelajari penggunaan cookies dan teknologi sejenis melalui Kebijakan Cookies Pharma Metric Labs."
          : "Learn about the use of cookies and similar technologies through the Pharma Metric Labs Cookie Policy."
      }
      relatedHref="/cookie-policy"
      relatedLabel={
        isIndonesian ? "Lihat Kebijakan Cookies" : "View Cookie Policy"
      }
    />
  );
}
