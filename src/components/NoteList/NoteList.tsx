import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";
import toast from "react-hot-toast";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (deletedNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(`Note "${deletedNote.title}" deleted!`);
    },
    onError: (error) => {
      toast.error(`Error deleting note: ${error.message}`);
    },
  });

  const handleDelete = (noteId: number) => {
    deleteMutation.mutate(noteId);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <div>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
          </div>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
