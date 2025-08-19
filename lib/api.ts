
import axios from 'axios';
import type { NewNote, Note, FetchNoteList } from '../types/note';

const api = axios.create({ baseURL: 'https://notehub-public.goit.study/api' });

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CANONICAL_TAGS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;
type CanonicalTag = (typeof CANONICAL_TAGS)[number];

type FetchNotesArgs = {
  page?: number;
  search?: string;
  tag?: CanonicalTag | undefined; 
  perPage?: number;
};

export async function fetchNotes({
  page = 1,
  search = '',
  tag,
  perPage = 12,
}: FetchNotesArgs): Promise<FetchNoteList> {
  const pageNum = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;

  const params: Record<string, string | number> = {
    perPage,
    page: pageNum,
  };

  const s = search.trim();
  if (s) params.search = s;

  if (tag) params.tag = tag; 

  const { data } = await api.get<FetchNoteList>('/notes', { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: NewNote): Promise<Note> {
  const { data } = await api.post<Note>('/notes', noteData);
  return data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${noteId}`);
  return data;
}

// вспомогалка — пригодится и на странице
export function toCanonicalTag(slug?: string): CanonicalTag | undefined {
  if (!slug) return undefined;
  const lc = slug.toLowerCase();
  if (lc === 'all') return undefined;
  return CANONICAL_TAGS.find(t => t.toLowerCase() === lc);
}
