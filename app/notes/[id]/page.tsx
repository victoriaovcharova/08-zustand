
import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const baseTitle = (note?.title ?? "").trim() || `Note ${id}`;
    const desc =
      ((note?.content ?? "").replace(/\s+/g, " ").trim() || `Read details for note ${id}.`).slice(0, 160);
    const title = `${baseTitle} | NoteHub`;

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        url: `/notes/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub logo",
          },
        ],
        type: "article",
      },
      alternates: {
        canonical: `/notes/${id}`,
      },
    };
  } catch {
    const title = `Note ${id} — Details | NoteHub`;
    const description = `Read details for note ${id}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/notes/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub logo",
          },
        ],
        type: "article",
      },
      alternates: {
        canonical: `/notes/${id}`,
      },
    };
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
