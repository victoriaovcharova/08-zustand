import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

type RouteParams = {
  params: { slug?: string[] };
};

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const slug = params.slug ?? ["All"];
  const rawTag = slug[0] ?? "All";
  const tag = rawTag === "All" ? "All" : rawTag;

  const title = `Notes: ${tag}`;
  const description = `${tag} notes list`;
  const safeTagForUrl = encodeURIComponent(tag);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-ten-kappa.vercel.app/notes/filter/${safeTagForUrl}`,
      images: [
        {
          // Використовуй з ТЗ:
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

export default async function FilteredNotesPage({ params }: RouteParams) {
  const slug = params.slug ?? ["All"];
  const rawTag = slug[0] ?? "All";
  const tag = rawTag === "All" ? undefined : rawTag;

  const initialNotes = await fetchNotes({
    search: "",
    page: 1,
    perPage: 12,
    tag,
  });

  return <NotesClient initialNotes={initialNotes} tag={tag ?? "All"} />;
}
