
import { fetchNotes, toCanonicalTag } from '@/lib/api';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

type Props = { params: { slug?: string[] } }; 

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const raw = params.slug?.[0] ?? 'all';
  const canonical = toCanonicalTag(raw);
  const pageStr = params.slug?.[1] ?? '1';
  const pageNum = Number.parseInt(pageStr, 10) || 1;

  const titleTag = canonical ?? 'All notes';
  const urlTag = (canonical ?? 'all').toString().toLowerCase();

  return {
    title: `Notes: ${titleTag}`,
    description: `Notes with tag: ${titleTag}`,
    openGraph: {
      title: `Notes: ${titleTag}`,
      description: `Notes with tag: ${titleTag}`,
      url: `https://08-zustand-livid.vercel.app/notes/filter/${urlTag}/${pageNum}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub logo',
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const raw = params.slug?.[0] ?? 'all';
  const canonicalTag = toCanonicalTag(raw); // undefined для "all"
  const pageStr = params.slug?.[1] ?? '1';
  const pageNum = Number.parseInt(pageStr, 10) || 1;

  const initialData = await fetchNotes({
    page: pageNum,
    search: '',
    tag: canonicalTag, 
  });

  return (
    <NotesClient
      initialData={initialData}
      initialTag={canonicalTag ?? 'All'}
      initialPage={pageNum}
    />
  );
}
