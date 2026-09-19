export const legacySlugs = [
  "404",
  "about",
  "activate",
  "admin",
  "article",
  "bjj-groupx",
  "bjj",
  "blog",
  "boxing-basics",
  "boxing",
  "classes",
  "conditioning",
  "cross-training",
  "dashboard",
  "experience",
  "first-timers",
  "functional",
  "groupx",
  "gym",
  "hyrox",
  "login",
  "policies",
  "pricing",
  "programs",
  "recovery",
  "register",
  "rooftop",
  "trial",
  "yoga",
] as const;

export type LegacySlug = (typeof legacySlugs)[number];

export const legacyAdapterSlugs = legacySlugs.filter((slug) => slug !== "admin");

export function isLegacySlug(value: string): value is LegacySlug {
  return legacySlugs.some((slug) => slug === value);
}
