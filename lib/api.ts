
import axios from 'axios';
import type { NewNote, Note, FetchNoteList } from '../types/note';

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});


const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;


api.interceptors.response.use(
  r => r,
  err => {
    if (err?.response) {
      console.error(
        'API error:',
        err.response.status,
        err.config?.method?.toUpperCase(),
        err.config?.url,
        err.response.data || err.message
      );
    } else {
      console.error('API error:', err?.message || err);
    }
    return Promise.reject(err);
  }
);

// ---- TYPES ----
export type FetchNotesArgs = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string; // 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping'
};

// ---- LIST (GET) ----
// Объектный вызов:
export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesArgs): Promise<FetchNoteList> {
  const params: Record<string, string | number> = {
    page: Math.max(1, Number(page) || 1),
    perPage: Math.max(1, Number(perPage) || 12),
  };
  const s = (search ?? '').trim();
  if (s) params.search = s;
  if (tag && tag.toLowerCase() !== 'all') params.tag = tag;

  const res = await api.get<FetchNoteList>('/notes', { params });
  return res.data;
}

// ---- ONE (GET) ----
export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

// ---- CREATE (POST) ----
export async function createNote(noteData: NewNote): Promise<Note> {
  const res = await api.post<Note>('/notes', noteData, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
}

// ---- DELETE (DELETE) ----
export async function deleteNote(noteId: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${noteId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
}
