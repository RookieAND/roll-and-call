import { notFound } from "next/navigation";

import { BookPickerPreview } from "@/views/rulebook-apply";

export default function BookPickerPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <BookPickerPreview />;
}
