import axios from 'axios';
import type { NewNote, Note, FetchNoteList } from '../types/note';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<FetchNoteList> => {
  const params = {
    perPage: 12,
    page,
    tag,
    search,
  };

  if (search.trim() !== '') {
    params.search = search;
  }

  const response = await axios.get<FetchNoteList>(`/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createNote = async (noteData: NewNote): Promise<Note> => {
  const response = await axios.post<Note>('/notes', noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};