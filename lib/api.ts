
import axios from 'axios';
import type { NewNote, Note, FetchNoteList } from '../types/note';


axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://notehub-public.goit.study/api';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN!;
const authHeaders = { Authorization: `Bearer ${token}` };


axios.interceptors.request.use((config) => {
  const url = new URL((config.baseURL || '') + (config.url || ''), 'http://x');
  const params = config.params as Record<string, string | number | undefined> | undefined;
  if (params) for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, String(v));
  console.log('[API]', (config.method || 'get').toUpperCase(), url.href.replace('http://x', config.baseURL || ''));
  return config;
});
axios.interceptors.response.use(
  r => r,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || err.message;
    console.error('[API ERROR]', status, msg);
    return Promise.reject(err);
  }
);


export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<FetchNoteList> => {
  const params: Record<string, string | number> = {
    perPage: 12,
    page: Math.max(1, Number(page) || 1),
  };

  const s = (search ?? '').trim();
  if (s) params.search = s;

 
  if (tag && tag.toLowerCase() !== 'all') params.tag = tag;

  const res = await axios.get<FetchNoteList>('/notes', {
    headers: authHeaders,
    params,
  });

  return res.data;
};

// -------- ONE --------
export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await axios.get<Note>(`/notes/${id}`, { headers: authHeaders });
  return res.data;
};

// -------- CREATE --------
export const createNote = async (noteData: NewNote): Promise<Note> => {
  const res = await axios.post<Note>('/notes', noteData, { headers: authHeaders });
  return res.data;
};

// -------- DELETE --------
export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await axios.delete<Note>(`/notes/${noteId}`, { headers: authHeaders });
  return res.data;
};
