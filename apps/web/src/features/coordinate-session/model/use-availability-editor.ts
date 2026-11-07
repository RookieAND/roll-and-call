"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { availabilityQuery } from "@/entities/availability";
import { AppError } from "@/shared/api";
import { toast, useBeforeUnloadWarning } from "@/shared/ui";

import { saveAvailability } from "../api/save-availability";
import { useSlotPainter } from "./use-slot-painter";

// 칠하기 상태와 저장. 격자(모바일 하단 막대 포함)와 데스크톱 요약 패널이 같은 값을 읽는다.
export function useAvailabilityEditor({
  gameId,
  savedMine,
  blocked,
}: {
  gameId: string;
  savedMine: string[];
  blocked: string[];
}) {
  const painter = useSlotPainter({ initial: savedMine, saved: savedMine, blocked });
  const queryClient = useQueryClient();
  const { server } = useParams<{ server: string }>();
  const { mutate, isPending: pending } = useMutation({
    mutationFn: async (keys: string[]) => {
      const result = await saveAvailability({ gameId, slotIsos: keys });
      if (result.error) throw new AppError(result.error, result.errorDisplay);
      return keys;
    },
    meta: { errorMessage: "가능 시간을 저장하지 못했습니다" },
    onSuccess: (keys) => {
      painter.markSaved(keys);
      toast.success("가능 시간을 저장했습니다");
      // 전체 겹침·확정 후보가 같은 캐시를 읽으므로 저장 결과를 다시 받아 반영한다.
      return queryClient.invalidateQueries({
        queryKey: availabilityQuery({ slug: server, gameId }).queryKey,
      });
    },
  });

  useBeforeUnloadWarning(painter.dirty);

  return { painter, pending, save: () => mutate([...painter.selected]) };
}

export type AvailabilityEditor = ReturnType<typeof useAvailabilityEditor>;
