export const HELP_CATEGORY = {
  join: "참여하기",
  host: "GM으로 운영하기",
  account: "계정",
} as const;

export type HelpCategory = (typeof HELP_CATEGORY)[keyof typeof HELP_CATEGORY];

export const HELP_CATEGORIES = [
  HELP_CATEGORY.join,
  HELP_CATEGORY.host,
  HELP_CATEGORY.account,
] as const;

import { GAME_STATUS, type GameStatus } from "@/entities/game";

export const HELP_FIGURE = {
  gameList: "gameList",
  heatGrid: "heatGrid",
  formFields: "formFields",
  rosterRows: "rosterRows",
  linkMarks: "linkMarks",
} as const;

export type HelpFigureKey = (typeof HELP_FIGURE)[keyof typeof HELP_FIGURE];

export const HELP_BLOCK = {
  steps: "steps",
  rows: "rows",
  compare: "compare",
  note: "note",
  figure: "figure",
} as const;

export type HelpStep = {
  title: string;
  body: string;
  note?: string;
  figure?: HelpFigureKey;
};

export type HelpRow = {
  term: string;
  description: string;
  // 시안이 실물 배지·칩으로 그린 자리. 글씨만 두면 무엇을 가리키는 말인지 흐려진다.
  status?: GameStatus;
  chip?: boolean;
};

export type HelpBlock =
  | { kind: typeof HELP_BLOCK.steps; steps: HelpStep[] }
  | { kind: typeof HELP_BLOCK.figure; figure: HelpFigureKey }
  | { kind: typeof HELP_BLOCK.rows; label: string; rows: HelpRow[] }
  | {
      kind: typeof HELP_BLOCK.compare;
      columns: { title: string; summary: string; rows: HelpRow[] }[];
    }
  | { kind: typeof HELP_BLOCK.note; body: string };

export type HelpDoc = {
  slug: string;
  category: HelpCategory;
  title: string;
  lead: string;
  blocks: HelpBlock[];
  related: string[];
};

export const HELP_DOCS: HelpDoc[] = [
  {
    slug: "find-and-join",
    category: HELP_CATEGORY.join,
    title: "구인 찾고 신청하기",
    lead: "구인 목록에서 신청까지 세 단계입니다.\n신청한 다음은 모집 방식에 따라 달라집니다.",
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "모집 중인 구인을 고릅니다",
            body: "구인 목록 탭에서 배지가 모집 중인 글만 신청을 받습니다.\n상단 필터로 게임 종류와 요일을 좁힐 수 있습니다.",
            figure: HELP_FIGURE.gameList,
          },
          {
            title: "상세에서 조건을 확인하고 신청합니다",
            body: "게임 종류, 예상 플레이 시간, 정원이 상세 위쪽에 있습니다.\n화면 맨 아래 신청하기를 누르면 접수되며,\n확정 전까지는 같은 자리에서 취소할 수 있습니다.",
          },
          {
            title: "결과를 기다립니다",
            body: "선착순은 자리가 남아 있으면 누른 즉시 확정됩니다.\n추첨은 신청 기한이 지난 뒤 GM이 선정하여 안내합니다.",
            note: "정원이 찼어도 대기 접수 중이면 신청할 수 있습니다.\n앞사람이 빠지면 순서대로 올라갑니다.",
          },
        ],
      },
    ],
    related: ["recruit-methods", "schedule-grid"],
  },
  {
    slug: "recruit-methods",
    category: HELP_CATEGORY.join,
    title: "선착순과 추첨은 무엇이 다른가요",
    lead: "GM이 구인을 열 때 둘 중 하나를 고릅니다.\n다른 점은 자리가 언제 정해지느냐 하나입니다.",
    blocks: [
      {
        kind: HELP_BLOCK.compare,
        columns: [
          {
            title: "선착순",
            summary: "누른 순서대로 자리가 찹니다.",
            rows: [
              { term: "신청 직후", description: "자리가 남았으면 즉시 확정" },
              { term: "정원이 찬 뒤", description: "대기 접수를 열어둔 글에만 신청 가능" },
            ],
          },
          {
            title: "추첨",
            summary: "기한까지 모아 GM이 뽑습니다.",
            rows: [
              { term: "신청 직후", description: "접수만 되고 자리는 비어 있음" },
              { term: "기한이 지난 뒤", description: "추첨 후 결과 개별 안내" },
            ],
          },
        ],
      },
      {
        kind: HELP_BLOCK.rows,
        label: "카드에 붙는 칩",
        rows: [
          { term: "확정 2 · 정원 4", description: "선착순 — 이미 자리를 받은 사람 수", chip: true },
          { term: "신청 7 · 정원 4", description: "추첨 — 뽑기를 기다리는 사람 수", chip: true },
        ],
      },
      {
        kind: HELP_BLOCK.note,
        body: "추첨은 정원이 차도 기한까지 기다립니다.\n빨리 자리를 잡고 싶다면 선착순 글이 낫습니다.",
      },
    ],
    related: ["status-glossary", "find-and-join"],
  },
  {
    slug: "schedule-grid",
    category: HELP_CATEGORY.join,
    title: "일정 조율 격자 쓰는 법",
    lead: "격자는 참여자들이 가능한 시간을 겹쳐서 보여줍니다.\n색이 진할수록 그 시간에 가능한 사람이 많다는 뜻입니다.",
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "칸을 끌어서 칠합니다",
            body: "가로는 날짜, 세로는 시각을 의미합니다.\n여러 칸이 한 번에 칠해지고, 칠한 칸을 다시 끌면 지워집니다.",
            figure: HELP_FIGURE.heatGrid,
          },
          {
            title: "저장합니다",
            body: "칠한 뒤 아직 저장하지 않은 칸은 테두리로 표시됩니다.\n화면 아래 저장을 누르면 다른 참여자에게도 반영됩니다.",
          },
          {
            title: "확정을 기다립니다",
            body: "참여자들의 칸이 모이면 GM이 한 시간대를 고릅니다.\n확정된 일정은 홈 달력과 마이페이지 내 세션에 함께 올라갑니다.",
            note: "사정이 바뀌면 확정 전까지 다시 칠해도 됩니다.\n늦게 고치면 GM이 일정을 다시 수정해야 하니,\n사정을 알게 되는 대로 일정을 고쳐 주세요.",
          },
        ],
      },
    ],
    related: ["status-glossary", "manage-roster"],
  },
  {
    slug: "create-game",
    category: HELP_CATEGORY.host,
    title: "구인 등록하기",
    lead: '구인 목록 오른쪽 위 "새 구인"에서 시작합니다.\n네 단계이며, 중간에 나가도 임시 저장됩니다.',
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "게임",
            body: "게임명, 룰, 시놉시스, 예상 플레이 시간을 적습니다.\n어떤 이야기인지를 먼저 정하고, 모집 조건은 뒤에서 정합니다.",
            figure: HELP_FIGURE.formFields,
          },
          {
            title: "참여 전 안내",
            body: "장르, 트리거, 사용 플랫폼, 주의 사항 등을 적습니다.\n신청 전에 알아야 할 것들이라 한 단계로 묶었습니다.",
          },
          {
            title: "이미지",
            body: "세션 구인 목록에 쓸 썸네일 이미지 한 장과\n상세 설명에 붙일 이미지를 다섯 장까지 올립니다.\n올리지 않으면 썸네일에는 기본 배경이 들어갑니다.",
          },
          {
            title: "모집",
            body: "정원을 정하고 선착순과 추첨 중 선정 방식을 지정합니다.\n선착순은 정원이 차도 대기 신청을 받을지 고를 수 있습니다.",
            note: "등록 뒤에 고칠 수 있는 것은 제목·소개·이미지·정원입니다.\n모집 방식은 변경할 수 없어 새로 세션을 개설해야 합니다.",
          },
        ],
      },
    ],
    related: ["manage-roster", "recruit-methods"],
  },
  {
    slug: "manage-roster",
    category: HELP_CATEGORY.host,
    title: "참여자 뽑고 일정 확정하기",
    lead: '신청이 모이면 구인 상세 아래 "운영 관리"로 들어갑니다.\n참여자 관리 화면에서 사람과 일정을 차례로 정합니다.',
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "참여자를 정합니다",
            body: "선착순이면 결과가 이미 정해져 있습니다.\n추첨이면 기한이 지난 뒤 신청자 중에서 정원만큼 고릅니다.\n확정과 대기는 나중에 서로 바꿀 수 있습니다.",
            figure: HELP_FIGURE.rosterRows,
          },
          {
            title: "일정을 모읍니다",
            body: "확정된 사람에게 조율 격자가 열립니다.\n아직 칠하지 않은 사람은 참여자 관리 화면에서\n한 번에 재촉할 수 있습니다.",
          },
          {
            title: "한 시간대를 확정합니다",
            body: "격자에서 가장 진한 칸을 고르고 확정을 누릅니다.\n확정한 일정은 알림으로 가고 홈 달력에 올라갑니다.",
            note: "확정 뒤에 인원이 빠지면 대기자를 올려 다시 채울 수 있습니다.\n일정은 그대로 두고 사람만 바뀝니다.",
          },
        ],
      },
    ],
    related: ["create-game", "schedule-grid"],
  },
  {
    slug: "profile-links",
    category: HELP_CATEGORY.account,
    title: "프로필과 링크 설정",
    lead: "마이페이지 → 프로필 편집에서 고칩니다.\n프로필은 GM과 같은 세션 사람들이 봅니다.",
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "이름과 소개",
            body: "이름은 신청 목록과 참여자 목록에 그대로 나옵니다.\n소개에는 좋아하는 장르나 플레이 성향 등을 적습니다.",
          },
          {
            title: "링크는 여섯 개까지 걸 수 있습니다",
            body: "디스코드·X·인스타그램·블루스카이·유튜브·스프레드시트·드라이브·노션은\n브랜드 마크가 자동으로 붙습니다.\n목록에 없는 곳은 기타 주소로 둡니다.",
            figure: HELP_FIGURE.linkMarks,
          },
          {
            title: "기본 가능 시간",
            body: "자주 가능한 요일과 시간대를 저장해 두면\n조율 격자가 그 칸이 칠해진 상태로 열립니다.\n세션마다 다시 칠해도 됩니다.",
            note: "프로필은 사이트를 로그인한 사람에게만 보입니다.\n검색 결과나 외부 공유 링크에는 나오지 않습니다.",
          },
        ],
      },
    ],
    related: ["schedule-grid", "find-and-join"],
  },
  {
    slug: "status-glossary",
    category: HELP_CATEGORY.account,
    title: "상태 용어 사전",
    lead: "배지는 글의 모집 상태만 말합니다.\n일정에 관한 것은 배지가 아니라 문장으로 적습니다.",
    blocks: [
      {
        kind: HELP_BLOCK.rows,
        label: "글에 붙는 배지",
        rows: [
          {
            term: "모집 중",
            description: "자리가 남았거나 추첨 진행을 하기 전",
            status: GAME_STATUS.recruiting,
          },
          {
            term: "대기 접수 중",
            description: "정원은 찼지만 대기 신청은 받는 중",
            status: GAME_STATUS.confirmed,
          },
          {
            term: "모집 마감",
            description: "정원이 찼거나 GM이 닫아 더 받지 않음",
            status: GAME_STATUS.closed,
          },
        ],
      },
      {
        kind: HELP_BLOCK.rows,
        label: "내 상태",
        rows: [
          { term: "신청", description: "접수됐고 결과를 기다리는 중" },
          { term: "확정", description: "자리를 받았고 조율 격자가 열린 상태" },
          { term: "대기", description: "번호를 받아 추가 모집을 기다리는 상태" },
        ],
      },
      {
        kind: HELP_BLOCK.rows,
        label: "헷갈리기 쉬운 두 기한",
        rows: [
          { term: "신청 기한", description: "추첨 글의 신청이 닫히는 날. 이후 GM이 뽑습니다." },
          { term: "세션 날짜", description: "실제로 모여 굴리는 날. 조율이 끝나야 정해집니다." },
        ],
      },
    ],
    related: ["recruit-methods", "find-and-join"],
  },
];
