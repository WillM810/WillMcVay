import { ClientOnly } from "./client";

export async function generateStaticParams() {
  return [
    { slug: [] },
  ];
}

export default function Page({ params }: { params: { slug: string[] } }) {
  return <ClientOnly />;
}