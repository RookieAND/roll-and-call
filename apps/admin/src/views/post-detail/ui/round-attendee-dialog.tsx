import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { MODAL_FOOTER_CLASS, ModalServerLabel, ResponsiveDialog } from "@/shared/ui";

import type { AdminRound } from "../model/admin-rounds";

interface RoundAttendeeDialogProps {
  open: boolean;
  // 닫히는 동안에도 내용이 남도록 호출하는 쪽이 마지막으로 연 회차를 넘긴다.
  round: AdminRound | null;
  onClose: () => void;
}

export function RoundAttendeeDialog({ open, round, onClose }: RoundAttendeeDialogProps) {
  return (
    <ResponsiveDialog.Root open={open} onOpenChange={(next) => next || onClose()}>
      <ResponsiveDialog.Popup size="lg" className="max-w-[480px]">
        {round && (
          <>
            <ResponsiveDialog.Header>
              <ModalServerLabel />
              <ResponsiveDialog.Title>{round.roundNo}회차 출석</ResponsiveDialog.Title>
            </ResponsiveDialog.Header>
            <ResponsiveDialog.Body>
              {isNull(round.attendanceConfirmedAt) ? (
                <Text typography="body3" foreground="muted">
                  출석을 아직 확정하지 않았습니다.
                </Text>
              ) : (
                <VStack gap="100">
                  {round.attendees.map((attendee) => (
                    <HStack key={attendee.userId} justify="between" align="center" gap="100">
                      <Text typography="body3" truncate>
                        {attendee.nickname}
                      </Text>
                      <Text
                        typography="body3"
                        foreground={attendee.attended ? "normal" : "danger"}
                        className="shrink-0"
                      >
                        {attendee.attended ? "참석" : "빠짐"}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              )}
            </ResponsiveDialog.Body>
            <ResponsiveDialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
              <ResponsiveDialog.Close render={<Button variant="outline" colorPalette="gray" />}>
                닫기
              </ResponsiveDialog.Close>
            </ResponsiveDialog.Footer>
          </>
        )}
      </ResponsiveDialog.Popup>
    </ResponsiveDialog.Root>
  );
}
