"use client";

import { Button } from "@roll-and-call/ui";

import { toast } from "@/shared/ui";

interface ReopenAttendanceButtonProps {
  onReopen: () => void;
}

export function ReopenAttendanceButton({ onReopen }: ReopenAttendanceButtonProps) {
  return (
    <Button
      variant="outline"
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
