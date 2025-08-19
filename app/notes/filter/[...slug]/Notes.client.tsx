'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './NotesPage.module.css';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import type { NewNote } from '@/types/note';
import Link from 'next/link';

type NotesClientProps = {
  initialTag?: string; // "All" або реальний тег
};

// допустимі теги з доменної моделі
type Tag = NewNote['tag'];
const TAGS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

function normalizeTag(raw?: string): Tag | undefined {
  if (!raw) return undefined;
  const t = raw[0].toUpperCase() + raw.slice(1).toLowerCase();
  return (TAGS as readonly string[]).includes(t as Tag) ? (t as Tag) : undefined;
}

export default function NotesClient({ initialTag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedValue(value.trim());
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const tagParam = normalizeTag(initialTag);

  const { data, isFetching, isError } = useQuery({
    queryKey: ['notes', { page: currentPage, search: debouncedValue, tag: tagParam }],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        search: debouncedValue,
        ...(tagParam ? { tag: tagParam } : {}),
      }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={(page: number) => setCurrentPage(Math.max(1, page))}
            totalPages={totalPages}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Note +
        </Link>
      </header>

      {isFetching && <p className={css.loading}>loading notes...</p>}
      {isError && <p className={css.error}>Server error. Sorry!</p>}
      {data && !isFetching && <NoteList notes={data.notes} />}
    </div>
  );
}
