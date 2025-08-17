'use client';

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css"
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";

type Props = {
  initialNotes: FetchNotesResponse;
  tag: string;
}

export default function NotesClient({ initialNotes, tag }: Props) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const handleSearch = useDebouncedCallback((search: string) => { setDebouncedSearch(search) }, 500);

  const handleSearchCange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setSearch(search);
    setPage(1);
    handleSearch(search);
  };


    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ['notes', page, debouncedSearch, tag],
        queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch, ...(tag !== "All" ? {tag} : {}) }),
      placeholderData: keepPreviousData,
        initialData: page === 1 && debouncedSearch === '' ? initialNotes : undefined,
    });


    if(isLoading) return <p>Loading, please wait...</p>;
    if (error) return <p>Something went wrong: {error.message}</p>;
    if (!data) return <p>No notes found.</p>;

    return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchCange} />
       {data && data.total_pages > 1 && (
          <Pagination
            page={page}
            total={data.total_pages}
            onChange={setPage}
          />
        )}
        <Link className={css.button} href="/notes/action/create">Create +</Link>
      </header>
       
      {isSuccess && data?.data?.length > 0 ? (
        <NoteList notes={data.data} />)
        : (
          <p>No notes found</p>
        )
      }
     </div>
  );
};