import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

type PageProps = { params: { slug: string[] } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const raw = params.slug[0];
  const tag = raw === "All" ? "All" : raw;

  const title = `Notes: ${tag}`;
  const description = `${tag} notes list`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-ten-kappa.vercel.app/notes/filter/${encodeURIComponent(tag)}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Open Graph image",
        },
      ],
      type: "article",
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const raw = params.slug[0];
  const tag = raw === "All" ? undefined : raw;

  const initialNotes = await fetchNotes({
    search: "",
    page: 1,
    ...(tag ? { tag } : {}),
  });

  return <NotesClient initialNotes={initialNotes} tag={tag ?? "All"} />;
}
