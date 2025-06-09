export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  _id: number;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
}

export type NoteData = Pick<Note, "title" | "content" | "tag">;
