// app/notes/filter/[...slug]/page.tsx
import type { Metadata } from 'next';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { FetchNoteList } from '@/types/note';

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug?.[0] ?? 'all';
  const isAll = raw.toLowerCase() === 'all';

  // Для тайтла/описания показываем «All notes», а в URL используем исходный slug
  const tagUi = isAll ? 'All notes' : raw;
  const path = `/notes/filter/${encodeURIComponent(raw)}`;
  const site = 'https://08-zustand-livid.vercel.app';

  const title = `Notes: ${tagUi}`;
  const description = `Notes with tag: ${isAll ? 'All' : raw}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${site}${path}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub logo',
        },
      ],
      type: 'article',
    },
    alternates: { canonical: path },
  };
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const raw = slug?.[0] ?? 'all';
  const isAll = raw.toLowerCase() === 'all';

  // В API НЕ отправляем "All"
  const tagForQuery = isAll ? undefined : raw;
  const initialTag = isAll ? 'All' : raw;

  let initialData: FetchNoteList;
  try {
    // позиционный вызов, как у тебя было
    initialData = await fetchNotes(1, '', tagForQuery);
  } catch (e) {
    console.error('fetchNotes failed on server:', e);
    // фолбек строго под твой тип FetchNoteList
    initialData = { notes: [], totalPages: 0 } as FetchNoteList;
  }

  return <NotesClient initialData={initialData} initialTag={initialTag} />;
}
