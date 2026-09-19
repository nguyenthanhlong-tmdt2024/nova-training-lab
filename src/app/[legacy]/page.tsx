import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage, readLegacyPage } from "@/components/legacy-page";
import { isLegacySlug, legacyAdapterSlugs } from "@/lib/legacy-routes";

export function generateStaticParams() {
  return legacyAdapterSlugs.map((legacy) => ({ legacy }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legacy: string }>;
}): Promise<Metadata> {
  const { legacy } = await params;
  if (!isLegacySlug(legacy)) return {};
  const page = readLegacyPage(legacy);
  return { title: page.title, description: page.description };
}

export default async function LegacyRoute({
  params,
}: {
  params: Promise<{ legacy: string }>;
}) {
  const { legacy } = await params;
  if (!isLegacySlug(legacy)) notFound();
  return <LegacyPage slug={legacy} />;
}
