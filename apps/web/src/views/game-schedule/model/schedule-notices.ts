export const SCHEDULE_NOTICE = {
  awaitingDraw: {
    title: "추첨 뒤에 조율을 엽니다",
    lines: ["모집 마감 때 추첨 결과가 정해지면 확정된 사람에게 기본 가능 시간이 칠해집니다."],
  },
  awaitingSelection: {
    title: "선발을 마친 뒤에 조율을 엽니다",
    lines: ["GM이 선발을 마치면 확정된 사람에게 기본 가능 시간이 칠해집니다."],
  },
  unscheduled: {
    title: "일정을 정하지 못했습니다",
    lines: ["확정된 참여자 없이 모집이 끝났습니다."],
  },
  deadlinePassed: {
    title: "모집 기한이 지났습니다",
    lines: ["GM이 세션 시간을 확정하는 중입니다.", "가능 시간은 지금도 고칠 수 있습니다."],
  },
} as const;
