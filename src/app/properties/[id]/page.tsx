import { notFound } from "next/navigation";
import { getPropertyById, properties } from "@/data/properties";
import PropertyDetailClient from "./PropertyDetailClient";

export const dynamic = "force-static";

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} />;
}
