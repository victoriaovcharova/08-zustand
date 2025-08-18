
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { FetchNoteList } from "@/types/note";

type PageProps = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug?.[0] ?? "all";
  const isAll = raw.toLowerCase() === "all";
  const tagUi = isAll ? "All" : raw;

  const title = `Notes: ${tagUi}`;
  const description = `Notes with tag: ${tagUi}`;
  const path = `/notes/filter/${encodeURIComponent(raw)}`;
  const site = "https://08-zustand-livid.vercel.app";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${site}${path}`,
      images: [
        { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg", width: 1200, height: 630, alt: "NoteHub logo" },
      ],
      type: "article",
    },
    alternates: { canonical: path },
  };
}

export default async function NotesPage({ params }: PageProps) {
  const { slug } = await params;
  const raw = slug?.[0] ?? "all";
  const isAll = raw.toLowerCase() === "all";
  const tagForQuery = isAll ? undefined : raw;
  const initialTag = isAll ? "All" : raw;

  let initialData: FetchNoteList;
  try {
   
    initialData = await fetchNotes({
      page: 1,
      search: "",
      ...(tagForQuery ? { tag: tagForQuery } : {}),
    });
   
  } catch (e) {
    console.error("fetchNotes failed on server:", e);
   
    initialData = { notes: [], totalPages: 0 } as FetchNoteList;
  }

  return <NotesClient initialData={initialData} initialTag={initialTag} />;
}
