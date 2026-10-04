"use client";

import { Container } from "@roll-and-call/ui";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";
import { ReviewListSkeleton } from "@/views/reviews";

export default function Loading() {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <AppBar back={`/games/${id}`} title="세션 후기" />
      <Container size="sm" className="py-200">
        <ReviewListSkeleton />
      </Container>
    </>
  );
}
