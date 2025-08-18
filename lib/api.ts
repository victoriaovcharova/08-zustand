import axios from 'axios';
import type { NewNote, Note, FetchNoteList } from '../types/note';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://notehub-public.goit.global/api',
});

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

// GET без токена, POST/DELETE — с токеном (если он есть)
export type FetchNotesArgs = { page?: number; perPage?: number; search?: string; tag?: string };

// Поддержка объектного И позиционного вызова:
export async function fetchNotes(args: FetchNotesArgs): Promise<FetchNoteList>;
export async function fetchNotes(page: number, search: string, tag?: string): Promise<FetchNoteList>;
export async function fetchNotes(a: FetchNotesArgs | number, b?: string, c?: string): Promise<FetchNoteList> {
  const inArgs: FetchNotesArgs = typeof a === 'number' ? { page: a, search: b ?? '', tag: c } : (a || {});
  const page = Math.max(1, Number(inArgs.page) || 1);
  const perPage = Math.max(1, Number(inArgs.perPage) || 12);
  const s = (inArgs.search ?? '').trim();
  const tag = inArgs.tag && inArgs.tag.toLowerCase() !== 'all' ? inArgs.tag : undefined;

  const params: Record<string, string | number> = { page, perPage };
  if (s) params.search = s;
  if (tag) params.tag = tag;

  const res = await api.get<FetchNoteList>('/notes', { params });
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(noteData: NewNote): Promise<Note> {
  const res = await api.post<Note>('/notes', noteData, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${noteId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
}
