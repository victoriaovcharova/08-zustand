// app/notes/filter/[...slug]/page.tsx
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { FetchNoteList } from "@/types/note";

// ЕДИНЫЙ тип для страницы и generateMetadata — params как Promise
type PageProps = { params: Promise<{ slug: string[] }> };

// допустимые теги
const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
type Tag = (typeof TAGS)[number];

function normalizeTag(raw?: string): Tag | undefined {
  if (!raw) return undefined;
  const t = raw[0].toUpperCase() + raw.slice(1).toLowerCase();
  return (TAGS as readonly string[]).includes(t as Tag) ? (t as Tag) : undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug?.[0] ?? "all";
  const tag = normalizeTag(raw);
  const tagUi = tag ?? "All";
  const path = `/notes/filter/${encodeURIComponent(raw)}`;
  const site = "https://08-zustand-livid.vercel.app";

  const title = `Notes: ${tagUi}`;
  const description = `Notes with tag: ${tagUi}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${site}${path}`,
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
    alternates: { canonical: path },
  };
}

export default async function NotesPage({ params }: PageProps) {
  const { slug } = await params; // ← тоже await
  const raw = slug?.[0] ?? "all";
  const tagForApi = normalizeTag(raw);    // Tag | undefined
  const initialTag = tagForApi ?? "All";  // для UI

  let initialData: FetchNoteList;
  try {
    initialData = await fetchNotes({
      page: 1,
      search: "",
      ...(tagForApi ? { tag: tagForApi } : {}),
    });
  } catch (err) {
    console.error("fetchNotes failed on server:", err);
    initialData = { notes: [], totalPages: 0 } as FetchNoteList;
  }

  return <NotesClient initialData={initialData} initialTag={initialTag} />;
}
