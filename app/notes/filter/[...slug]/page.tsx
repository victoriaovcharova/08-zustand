import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? "All notes" : slug[0]
  return {
    title: `Notes: ${tag}`,
    description: `Notes with tag: ${tag}`,
    openGraph: {
      title: `Notes: ${tag}`,
      description: `Notes with tag: ${tag}`,
      url: `https://08-zustand-livid.vercel.app/notes/filter/${tag}`,
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



export default async function NotesPage({params}: Props) {
  const { slug } = await params;
  console.log('slug', slug);


  const initialPage = 1;
  const initialQuery = '';
  const initialTag = slug[0] === 'all' ? undefined : slug[0];

  const initialData = await fetchNotes(initialPage, initialQuery, initialTag);

  return <NotesClient initialData={initialData} initialTag={ initialTag} />;
}