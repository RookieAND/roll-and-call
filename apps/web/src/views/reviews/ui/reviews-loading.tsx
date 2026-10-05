"use client";

import { Container } from "@roll-and-call/ui";
import { useParams } from "next/navigation";

import { AppBar } from "@/shared/ui";

import { ReviewListSkeleton } from "./review-list-skeleton";

interface ReviewsLoadingProps {
  backBase: "/users" | "/games";
  title: string;
}

export function ReviewsLoading({ backBase, title }: ReviewsLoadingProps) {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <AppBar back={`${backBase}/${id}`} title={title} />
      <Container size="sm" className="py-200">
        <ReviewListSkeleton />
      </Container>
    </>
  );
}
