import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Toaster, toast } from "react-hot-toast";

import { fetchNotes, createNote } from "../../services/noteService";
import { NoteData } from "../../types/note";

import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../NoteModal/NoteModal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import css from "./App.module.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearchQuery],
    queryFn: () => fetchNotes(currentPage, debouncedSearchQuery),
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully!");
      setIsModalOpen(false);
    },
    onError: (err) => {
      toast.error(`Error creating note: ${err.message}`);
    },
  });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleAddNote = (newNote: NoteData) => {
    createNoteMutation.mutate(newNote);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <Toaster position="top-right" reverseOrder={false} />
      <h1>NoteHub</h1>

      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage message={error.message} />}

      {notes.length > 0 && <NoteList notes={notes} />}

      {totalPages > 1 && !isLoading && (
        <div className={css.paginationContainer}>
          <Pagination pageCount={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onAdd={handleAddNote}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={createNoteMutation.isPending}
        />
      </NoteModal>
    </div>
  );
}
