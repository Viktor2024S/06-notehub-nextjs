import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const initialData = await fetchNotes(1, "");
  return <NotesClient initialData={initialData} />;
}
