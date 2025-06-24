import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}
export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  const numberId = Number(id);
  await queryClient.prefetchQuery({
    queryKey: ["note", numberId],
    queryFn: () => fetchNoteById(numberId),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
