'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './NotesPage.module.css';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import { FetchNoteList } from '@/types/note';
import Link from 'next/link';

type NotesClientProps = {
  initialData: FetchNoteList;
  initialTag?: string;
};

export default function NotesClient({ initialData, initialTag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedValue(value);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', currentPage, debouncedValue, initialTag],
    queryFn: () => fetchNotes(currentPage, debouncedValue, initialTag),
    placeholderData: keepPreviousData,
    initialData,
  });

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={(page: number) => setCurrentPage(page)}
            totalPages={totalPages}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Note +
        </Link>
      </header>

      {isLoading && <p className={css.loading}>loading notes...</p>}
      {isError && <p className={css.error}>Server error. Sorry!</p>}
      {data && !isLoading && <NoteList notes={data.notes} />}
    </div>
  );
}