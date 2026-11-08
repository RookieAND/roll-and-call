"use client";

import { Button } from "@roll-and-call/ui";

import { toast } from "@/shared/ui";

interface ReopenAttendanceButtonProps {
  onReopen: () => void;
  colorPalette?: "gray";
}

export function ReopenAttendanceButton({ onReopen, colorPalette }: ReopenAttendanceButtonProps) {
  return (
    <Button
      variant="outline"
      colorPalette={colorPalette}
      size="lg"
      className="w-full"
      onClick={() => {
        onReopen();
        toast.success("다시 고칠 수 있습니다");
      }}
    >
      다시 고치기
    </Button>
  );
}
