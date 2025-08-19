import css from './CreateNote.module.css';
import { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create Note',
  description: 'Write down your ideas',
  openGraph: {
    title: 'Create Note',
    description: 'Write down your ideas',
    siteName: 'NoteHub',
    url: 'https://08-zustand-livid.vercel.app/notes/action/create',
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

const CreateNote = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};

export default CreateNote;