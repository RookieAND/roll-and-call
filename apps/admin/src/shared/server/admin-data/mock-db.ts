import "server-only";
import { AUDIT_SEED_DETAILS } from "./audit-seed-details";
import { seedPosts } from "./posts-seed";
import type {
  AdminUser,
  AuditEntry,
  CertApplication,
  Certification,
  NoShow,
  Report,
  Rulebook,
  RulebookRequest,
  Session,
  Staff,
  StaffMemo,
} from "./types";

// ponytail: 서버 프로세스 메모리 목업. 재시작하면 초기값으로 돌아간다. 실제 API가 생기면 이 파일을 지운다.
const DAY = 86_400_000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY);
const at = (iso: string) => new Date(`${iso}+09:00`);

const LONG_TITLE = "마지막 열차는 자정에 — 3부: 종착역에서 내리지 못한 사람들";
const LONG_REASON =
  "앞면 사진에 적힌 닉네임이 신청자와 다르고, 뒷면은 같은 책의 뒤표지로 보기 어려웠습니다. 실물 책을 같은 장소에서 전체·앞·뒤·옆면 4장으로 다시 찍어 올려주세요. 쪽지에는 디스코드 닉네임을 정확히 적어주세요.";

const USER_ROWS = [
  ["달빛토끼", "moonrabbit", "2025-03-14", 12, 31, 12],
  ["김코코", "kimcoco", "2025-06-02", 3, 18, 3],
  ["새벽세시", "dawn3am", "2024-11-20", 41, 22, 41],
  ["파란우산", "blueumbrella", "2026-09-17", 0, 1, 0],
  ["탐정놀이중", "detective_ing", "2025-01-08", 2, 47, 1],
  ["이름없는GM", "nonamegm", "2025-08-29", 19, 9, 19],
  ["붉은자물쇠", "redlock", "2025-12-01", 2, 14, 2],
  ["오후の산책", "afternoonwalk", "2026-02-11", 0, 22, 0],
  ["모래시계", "hourglass", "2026-04-05", 6, 8, 6],
  ["열두시의종", "twelvebell", "2026-09-19", 0, 0, 0],
  ["조용한관측자", "quietobserver", "2025-05-23", 1, 35, 0],
  ["하얀고래", "whitewhale", "2025-09-30", 8, 12, 8],
] as const;

const RULEBOOK_ROWS = [
  ["크툴루의 부름", "7판", ["CoC", "콜오크", "크부"], true, false],
  ["크툴루의 부름", "6판", ["CoC6", "크부6"], true, false],
  ["인세인", "", ["인세", "INSANE"], true, false],
  ["더블크로스", "3rd", ["DX3", "더블크"], true, false],
  ["소드 월드", "2.5", ["SW2.5"], true, false],
  ["마기카로기아", "", ["마기카", "MGLG"], false, false],
  ["엠브리오 머신", "", [], true, true],
] as const;

function createDb() {
  const users: AdminUser[] = USER_ROWS.map(
    ([nickname, discordHandle, joined, hosted, played, recentHosted], index) => ({
      id: `u${index + 1}`,
      nickname,
      discordId: String(300000000000000000n + BigInt(index + 1) * 7919n),
      discordHandle,
      joinedAt: at(`${joined}T00:00:00`),
      hostedCount: hosted,
      playedCount: played,
      recentHostedCount: recentHosted,
      sanction:
        nickname === "탐정놀이중"
          ? {
              until: at("2026-10-30T23:59:59"),
              by: "새벽세시",
              at: at("2026-09-22T11:02:00"),
              reason: "반복된 불참",
            }
          : undefined,
    }),
  );
  const userId = (nickname: string) => users.find((user) => user.nickname === nickname)!.id;

  const staff: Staff[] = [
    { nickname: "새벽세시", role: "owner", since: at("2024-11-20T00:00:00") },
    { nickname: "달빛토끼", role: "staff", since: at("2025-04-02T00:00:00") },
    { nickname: "이름없는GM", role: "staff", since: at("2026-09-18T00:00:00") },
  ];

  const rulebooks: Rulebook[] = RULEBOOK_ROWS.map(
    ([name, edition, aliases, certRequired, hidden], index) => ({
      id: `b${index + 1}`,
      name,
      edition,
      aliases: [...aliases],
      certRequired,
      hidden,
    }),
  );

  const certifications: Certification[] = (
    [
      ["달빛토끼", "크툴루의 부름 7판", "2026-03-02"],
      ["달빛토끼", "더블크로스 3rd", "2026-05-11"],
      ["새벽세시", "크툴루의 부름 7판", "2026-02-01"],
      ["새벽세시", "인세인", "2026-02-01"],
      ["새벽세시", "소드 월드 2.5", "2026-03-20"],
      ["새벽세시", "크툴루의 부름 6판", "2026-04-02"],
      ["이름없는GM", "소드 월드 2.5", "2026-09-19"],
      ["이름없는GM", "인세인", "2026-08-30"],
      ["이름없는GM", "크툴루의 부름 7판", "2026-09-01"],
      ["모래시계", "크툴루의 부름 6판", "2026-06-14"],
      ["김코코", "크툴루의 부름 7판", "2026-07-08"],
      ["붉은자물쇠", "더블크로스 3rd", "2026-08-21"],
    ] as const
  ).map(([nickname, rulebook, approvedAt]) => ({
    userId: userId(nickname),
    rulebook,
    approvedAt: at(`${approvedAt}T12:00:00`),
    approvedBy: "달빛토끼",
  }));

  const noteRejection = {
    tags: ["닉네임 쪽지 문제", "뒷면 확인 불가"],
    requests: [
      "쪽지에 디스코드 닉네임을 정확히 적어 주세요",
      "같은 책의 뒤표지가 보이게 다시 찍어 주세요",
      "전체·앞·뒤·옆면 4장을 같은 장소에서 찍어 주세요",
    ],
  };
  const certApplication = (
    id: string,
    nickname: string,
    rulebook: string,
    waited: number,
    memo: string,
    extra: Partial<CertApplication> = {},
  ): CertApplication => ({
    id,
    userId: userId(nickname),
    rulebook,
    appliedAt: daysAgo(waited),
    memo,
    photoUrls: {},
    replacedShots: [],
    previousRejections: [],
    status: "pending",
    ...extra,
  });
  const certApplications: CertApplication[] = [
    certApplication(
      "c1",
      "달빛토끼",
      "크툴루의 부름 7판",
      6,
      "서점에서 구매한 책이고, 쪽지에 닉네임 적어서 같이 찍었습니다.",
    ),
    certApplication(
      "c2",
      "김코코",
      "인세인",
      5,
      "쪽지에 닉네임 다시 적어서 앞면만 새로 찍었습니다.",
      {
        replacedShots: ["front"],
        previousRejections: [{ rejectedAt: at("2026-09-14T15:00:00"), ...noteRejection }],
      },
    ),
    certApplication(
      "c3",
      "파란우산",
      "더블크로스 3rd",
      4,
      "중고로 구한 책이고 쪽지를 같이 찍었습니다.",
    ),
    certApplication(
      "c4",
      "조용한관측자",
      "크툴루의 부름 6판",
      3,
      "친구에게 빌린 책이 아니라 제 책입니다.",
    ),
    certApplication(
      "c5",
      "이름없는GM",
      "크툴루의 부름 6판",
      2,
      "6판 구판이라 표지가 조금 다릅니다.",
    ),
    certApplication("c6", "새벽세시", "더블크로스 3rd", 2, ""),
    certApplication(
      "c7",
      "붉은자물쇠",
      "크툴루의 부름 7판",
      1,
      "책등이 잘 보이게 다시 찍었습니다.",
      {
        replacedShots: ["side", "back"],
        previousRejections: [
          { rejectedAt: at("2026-08-30T20:00:00"), ...noteRejection },
          {
            rejectedAt: at("2026-09-12T11:00:00"),
            tags: ["사진 흐림"],
            requests: ["사진이 흐리지 않게 밝은 곳에서 다시 찍어 주세요"],
          },
        ],
      },
    ),
    certApplication("c8", "오후の산책", "인세인", 1, "처음 신청합니다."),
    certApplication("c9", "김코코", "소드 월드 2.5", 4, "", {
      status: "rejected",
      processedBy: "달빛토끼",
      processedAt: at("2026-09-22T13:58:00"),
    }),
  ];

  const rulebookRequests: RulebookRequest[] = [
    {
      id: "r1",
      userId: userId("탐정놀이중"),
      name: "크툴루의 부름 7판 개정",
      note: "CoC 7판 개정판으로 돌리고 있어요",
      requestedAt: daysAgo(4),
      similarTo: "크툴루의 부름 7판",
    },
    {
      id: "r2",
      userId: userId("김코코"),
      name: "섀도우런 6판",
      note: "정기적으로 열 계획입니다",
      requestedAt: daysAgo(2),
    },
    {
      id: "r3",
      userId: userId("달빛토끼"),
      name: "콜오크",
      note: "",
      requestedAt: daysAgo(1),
      similarTo: "크툴루의 부름 7판",
    },
  ];

  const noShowRows = [
    ["김코코", "안개 낀 등대", "크툴루의 부름 7판", "2026-09-20T20:00", "달빛토끼", false],
    ["탐정놀이중", LONG_TITLE, "인세인", "2026-09-19T21:00", "이름없는GM", false],
    ["붉은자물쇠", "붉은 여관의 밤", "더블크로스 3rd", "2026-09-18T20:30", "새벽세시", false],
    ["모래시계", "13번째 방", "크툴루의 부름 6판", "2026-09-15T19:00", "달빛토끼", false],
    ["김코코", "붉은 여관의 밤", "더블크로스 3rd", "2026-09-12T20:00", "하얀고래", false],
    ["조용한관측자", "안개 낀 등대", "크툴루의 부름 7판", "2026-09-10T21:00", "조용한관측자", true],
    ["붉은자물쇠", "13번째 방", "크툴루의 부름 6판", "2026-09-06T14:00", "새벽세시", false],
    ["모래시계", "마지막 열차는 자정에", "소드 월드 2.5", "2026-09-03T20:00", "이름없는GM", false],
    ["하얀고래", "안개 낀 등대", "크툴루의 부름 7판", "2026-08-30T19:30", "달빛토끼", true],
    ["탐정놀이중", "붉은 여관의 밤", "더블크로스 3rd", "2026-08-27T20:00", "새벽세시", false],
    ["김코코", "13번째 방", "크툴루의 부름 6판", "2026-08-22T21:00", "하얀고래", false],
    ["오후の산책", "마지막 열차는 자정에", "소드 월드 2.5", "2026-08-19T20:00", "모래시계", false],
  ] as const;

  const sessions: Session[] = noShowRows.map(
    ([nickname, title, rulebook, startsAt, gm], index) => ({
      id: `s${index + 1}`,
      title,
      rulebook,
      gmId: userId(gm),
      startsAt: at(`${startsAt}:00`),
      memberIds: [userId(nickname)],
      capacity: 4,
      closed: false,
    }),
  );
  sessions.push({
    id: `s${sessions.length + 1}`,
    title: LONG_TITLE,
    rulebook: "소드 월드 2.5",
    gmId: userId("김코코"),
    startsAt: at("2026-09-06T19:00:00"),
    memberIds: [userId("오후の산책")],
    capacity: 4,
    closed: false,
  });
  const upcoming = [
    [
      "u-fog",
      "안개 낀 등대",
      "크툴루의 부름 7판",
      "2026-09-27T20:00",
      "달빛토끼",
      ["김코코", "하얀고래", "모래시계"],
      4,
    ],
    [
      "u-room",
      "13번째 방",
      "크툴루의 부름 6판",
      "2026-10-04T14:00",
      "새벽세시",
      ["김코코", "붉은자물쇠"],
      4,
    ],
    [
      "u-train",
      LONG_TITLE,
      "크툴루의 부름 7판",
      "2026-10-11T19:00",
      "김코코",
      ["오후の산책", "조용한관측자", "파란우산"],
      5,
    ],
    [
      "u-inn",
      "붉은 여관의 밤",
      "더블크로스 3rd",
      "2026-10-03T20:00",
      "달빛토끼",
      ["탐정놀이중"],
      4,
    ],
  ] as const;
  for (const [id, title, rulebook, startsAt, gm, members, capacity] of upcoming) {
    sessions.push({
      id,
      title,
      rulebook,
      gmId: userId(gm),
      startsAt: at(`${startsAt}:00`),
      memberIds: members.map(userId),
      capacity,
      closed: false,
    });
  }

  const cancellations: Record<
    string,
    Pick<NoShow, "cancelledBy" | "cancelledAt" | "cancelReason">
  > = {
    조용한관측자: {
      cancelledBy: "이름없는GM",
      cancelledAt: at("2026-09-21T22:41:00"),
      cancelReason: "GM의 잘못된 처리로 확인",
    },
    하얀고래: {
      cancelledBy: "새벽세시",
      cancelledAt: at("2026-09-21T14:20:00"),
      cancelReason: "전날 디스코드로 GM에게 불참을 알린 메시지를 확인했습니다.",
    },
  };
  const noShows: NoShow[] = noShowRows.map(([nickname, , , , , cancelled], index) => {
    const startsAt = sessions[index]!.startsAt.getTime();
    return {
      id: `n${index + 1}`,
      userId: userId(nickname),
      sessionId: sessions[index]!.id,
      recordedAt: new Date(startsAt + (index % 3 === 1 ? -2 : 4) * 3_600_000),
      cancelled,
      ...(cancelled ? cancellations[nickname] : {}),
    };
  });

  const reports: Report[] = [
    { id: "p1", sessionId: sessions[3]!.id, reportedAt: daysAgo(3), resolved: false },
    { id: "p2", sessionId: sessions[2]!.id, reportedAt: daysAgo(1), resolved: false },
  ];

  const auditLog: AuditEntry[] = (
    [
      [
        "2026-09-22T14:20",
        "새벽세시",
        "인증 승인",
        "달빛토끼 · 크툴루의 부름 7판",
        "사진 4장 확인 완료",
      ],
      [
        "2026-09-22T13:58",
        "달빛토끼",
        "인증 반려",
        "김코코 · 인세인",
        LONG_REASON,
        "닉네임 쪽지 문제",
      ],
      ["2026-09-22T11:02", "새벽세시", "제재", "탐정놀이중 · 30일", "반복된 불참"],
      [
        "2026-09-21T22:41",
        "이름없는GM",
        "불참 취소",
        "조용한관측자 · 안개 낀 등대",
        "GM의 잘못된 처리로 확인",
      ],
      [
        "2026-09-21T19:15",
        "새벽세시",
        "구인 숨김",
        "13번째 방 · GM 모래시계",
        "시놉시스의 결말 스포일러",
      ],
      [
        "2026-09-21T10:30",
        "달빛토끼",
        "룰북 추가",
        "마기카로기아",
        "무료 배포 룰, 인증 없이 개설 허용",
      ],
      [
        "2026-09-20T23:12",
        "새벽세시",
        "인증 취소",
        "모래시계 · 더블크로스 3rd",
        "타인의 책 사진으로 확인",
      ],
      [
        "2026-09-20T16:44",
        "이름없는GM",
        "신고 처리 완료",
        "안개 낀 등대 · 신고 1건",
        "문제없음으로 확인",
      ],
      ["2026-09-19T21:09", "새벽세시", "제재 해제", "하얀고래", "이의 확인, 조치 철회"],
      [
        "2026-09-19T12:00",
        "달빛토끼",
        "인증 승인",
        "이름없는GM · 소드 월드 2.5",
        "사진 4장 확인 완료",
      ],
      ["2026-09-18T20:20", "새벽세시", "룰북 숨김", "엠브리오 머신", "중복 등록"],
      ["2026-09-18T09:31", "새벽세시", "운영진 추가", "이름없는GM · 운영진", "인증 심사 인력 보강"],
    ] as const
  ).map(([time, actor, action, target, reason, reasonTag], index) => ({
    id: `a${index + 1}`,
    at: at(`${time}:00`),
    actor,
    action,
    target,
    reason,
    reasonTag,
    ...AUDIT_SEED_DETAILS[`a${index + 1}`],
  }));

  const staffMemos: StaffMemo[] = (
    [
      [
        "김코코",
        "새벽세시",
        "2026-09-22T10:40",
        "제재를 확정하기 전에 디스코드 DM으로 상황을 확인했습니다. 본인은 일정을 착각했다고 설명했습니다.",
      ],
      [
        "김코코",
        "달빛토끼",
        "2026-09-19T21:10",
        "같은 GM의 세션에서 두 번 연속으로 불참했습니다. GM 쪽의 사전 공지도 늦었던 점을 함께 고려해야 합니다.",
      ],
      [
        "김코코",
        "달빛토끼",
        "2025-11-02T18:00",
        "세션 도중 이탈이 두 번째여서 7일 제재로 합의했습니다.",
      ],
    ] as const
  ).map(([nickname, author, time, body], index) => ({
    id: `m${index + 1}`,
    userId: userId(nickname),
    author,
    at: at(`${time}:00`),
    body,
  }));

  const settings = { certEnforcementDate: at("2026-10-02T00:00:00") };

  return {
    users,
    staff,
    rulebooks,
    certifications,
    certApplications,
    rulebookRequests,
    sessions,
    noShows,
    reports,
    auditLog,
    staffMemos,
    settings,
  };
}

type Db = ReturnType<typeof createDb>;
const globalForDb = globalThis as typeof globalThis & { adminMockDb?: Db };

// 개발 서버의 HMR이 모듈을 다시 읽어도 조치한 결과가 남도록 globalThis에 둔다.
export const db = (globalForDb.adminMockDb ??= createDb());
seedPosts(db);
