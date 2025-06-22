"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Toaster } from "react-hot-toast";
import { fetchNotes } from "@/lib/api";
import { Note } from "@/types/note";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteModal from "@/components/NoteModal/NoteModal";
import Loader from "@/components/Loader/Loader";

import css from "./Notes.module.css";

interface NotesClientProps {
  initialData: {
    notes: Note[];
    totalPages: number;
  };
}

export default function NotesClient({ initialData }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearchQuery],
    queryFn: () => fetchNotes(currentPage, debouncedSearchQuery),
    placeholderData: keepPreviousData,
    initialData: initialData,
  });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.container}>
      <Toaster position="top-right" reverseOrder={false} />
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        {totalPages > 1 && !isLoading && (
          <Pagination
            pageCount={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}

      {notes.length > 0 ? <NoteList notes={notes} /> : <p>No notes found.</p>}

      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
