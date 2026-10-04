"use client";

import { Button, type ButtonProps } from "@roll-and-call/ui";
import { useState } from "react";

import { AddToCalendarSheet, type AddToCalendarSheetProps } from "./add-to-calendar-sheet";

interface AddToCalendarButtonProps extends Omit<AddToCalendarSheetProps, "open" | "onOpenChange"> {
  variant: "outline" | "tinted";
  size?: ButtonProps["size"];
  className?: string;
}

export function AddToCalendarButton({
  variant,
  size,
  className,
  ...event
}: AddToCalendarButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)}>
        캘린더에 추가
      </Button>
      <AddToCalendarSheet open={open} onOpenChange={setOpen} {...event} />
    </>
  );
}
