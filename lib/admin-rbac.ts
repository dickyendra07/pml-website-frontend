export const ADMIN_PERMISSIONS = {
  MEDIA_READ: "media.read",
  MEDIA_WRITE: "media.write",
  CAREERS_READ: "careers.read",
  CAREERS_WRITE: "careers.write",
  CAREER_DOCUMENTATION_READ: "career_documentation.read",
  CAREER_DOCUMENTATION_WRITE: "career_documentation.write",
  CATALOGUE_REQUESTS_READ: "catalogue_requests.read",
  CATALOGUE_REQUESTS_WRITE: "catalogue_requests.write",
  CATALOGUES_READ: "catalogues.read",
  CATALOGUES_WRITE: "catalogues.write",
  FACILITIES_READ: "facilities.read",
  FACILITIES_WRITE: "facilities.write",
  HOMEPAGE_FEATURES_READ: "homepage_features.read",
  HOMEPAGE_FEATURES_WRITE: "homepage_features.write",
  INQUIRIES_READ: "inquiries.read",
  INQUIRIES_WRITE: "inquiries.write",
  INSIGHTS_READ: "insights.read",
  INSIGHTS_WRITE: "insights.write",
  LEGAL_PAGES_READ: "legal_pages.read",
  LEGAL_PAGES_WRITE: "legal_pages.write",
  POPUPS_READ: "popups.read",
  POPUPS_WRITE: "popups.write",
  SETTINGS_READ: "settings.read",
  SETTINGS_WRITE: "settings.write",
  SYSTEM_HEALTH_READ: "system_health.read",
  USERS_MANAGE: "users.manage",
  ROLES_MANAGE: "roles.manage",
} as const;

export type AdminPermission =
  (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS];

export const ADMIN_NAV_ITEMS: Array<{
  label: string;
  href: string;
  icon: string;
  permission?: AdminPermission;
}> = [
  { label: "Dashboard", href: "/admin", icon: "D" },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: "I",
    permission: ADMIN_PERMISSIONS.INQUIRIES_READ,
  },
  {
    label: "Homepage",
    href: "/admin/homepage-features",
    icon: "H",
    permission: ADMIN_PERMISSIONS.HOMEPAGE_FEATURES_READ,
  },
  {
    label: "Catalogues",
    href: "/admin/catalogues",
    icon: "C",
    permission: ADMIN_PERMISSIONS.CATALOGUES_READ,
  },
  {
    label: "Catalogue Requests",
    href: "/admin/catalogue-requests",
    icon: "R",
    permission: ADMIN_PERMISSIONS.CATALOGUE_REQUESTS_READ,
  },
  {
    label: "Insights",
    href: "/admin/insights",
    icon: "N",
    permission: ADMIN_PERMISSIONS.INSIGHTS_READ,
  },
  {
    label: "Careers",
    href: "/admin/careers",
    icon: "J",
    permission: ADMIN_PERMISSIONS.CAREERS_READ,
  },
  {
    label: "Career Documentation",
    href: "/admin/career-documentation",
    icon: "K",
    permission: ADMIN_PERMISSIONS.CAREER_DOCUMENTATION_READ,
  },
  {
    label: "Facilities",
    href: "/admin/facilities",
    icon: "F",
    permission: ADMIN_PERMISSIONS.FACILITIES_READ,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: "M",
    permission: ADMIN_PERMISSIONS.MEDIA_READ,
  },
  {
    label: "Popups",
    href: "/admin/popups",
    icon: "P",
    permission: ADMIN_PERMISSIONS.POPUPS_READ,
  },
  {
    label: "Legal Pages",
    href: "/admin/legal-pages",
    icon: "L",
    permission: ADMIN_PERMISSIONS.LEGAL_PAGES_READ,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "S",
    permission: ADMIN_PERMISSIONS.SETTINGS_READ,
  },
  {
    label: "System Health",
    href: "/admin/health",
    icon: "+",
    permission: ADMIN_PERMISSIONS.SYSTEM_HEALTH_READ,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: "U",
    permission: ADMIN_PERMISSIONS.USERS_MANAGE,
  },
  {
    label: "Roles",
    href: "/admin/roles",
    icon: "A",
    permission: ADMIN_PERMISSIONS.ROLES_MANAGE,
  },
];

export function hasAdminPermission(
  admin: { role: string; permissions: string[] },
  permission?: string,
) {
  return (
    !permission ||
    admin.role === "SUPER_ADMIN" ||
    admin.permissions.includes(permission)
  );
}

export function permissionForAdminPath(pathname: string) {
  return ADMIN_NAV_ITEMS.find(
    (item) => item.href !== "/admin" && pathname.startsWith(item.href),
  )?.permission;
}
