import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "@/types/note";
import { deleteNote } from "@/lib/api";
import css from "./NoteList.module.css";
import toast from "react-hot-toast";

export default function NoteList({ notes }: { notes: Note[] }) {
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
        <li key={note.id} className={`${css.listItem} ${css.item}`}>
          <div>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
          </div>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div className={css.actions}>
              <Link href={`/notes/${note.id}`} className={css.detailsBtn}>
                View details
              </Link>
              <button
                className={css.deleteBtn}
                onClick={() => handleDelete(note.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
