import { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

export const metadata: Metadata = {
  title: "Create a New Note | NoteHub",
  description:
    "Start writing a new note in NoteHub. Quickly create, edit, and organize your personal notes with a clean and efficient interface.",
  openGraph: {
    title: "Create a New Note | NoteHub",
    description:
      "Use NoteHub to create and organize personal notes with ease. Begin writing your new note now.",
    url: "https://08-zustand-two-xi.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "notehub create note",
      },
    ],
    type: "website",
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        {<NoteForm />}
      </div>
    </main>
  );
}