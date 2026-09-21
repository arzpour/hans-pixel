import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPageMeta, isValidPath } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getPageMeta(`/${slug.join("/")}`);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function NestedPage({ params }: Props) {
  const { slug } = await params;
  const pathname = `/${slug.join("/")}`;
  if (!isValidPath(pathname)) notFound();
  return null;
}
