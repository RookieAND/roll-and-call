import type { ReactNode } from "react";

import { GAME_STATUS, type GameStatus, RECRUIT_METHOD, type RecruitMethod } from "@/entities/game";

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
  modes: "modes",
  terms: "terms",
} as const;

export type HelpStep = {
  title: string;
  body: ReactNode;
  note?: ReactNode;
  figure?: HelpFigureKey;
};

export type HelpTerm = {
  term: string;
  description: ReactNode;
  // 시안이 실물 배지로 그린 자리. 글씨만 두면 무엇을 가리키는 말인지 흐려진다.
  status?: GameStatus;
  badge?: boolean;
};

export type HelpMode = {
  method: RecruitMethod;
  summary: string;
  steps: { title: string; body?: string }[];
  foot?: ReactNode;
};

export type HelpBlock =
  | { kind: typeof HELP_BLOCK.steps; steps: HelpStep[] }
  | { kind: typeof HELP_BLOCK.modes; modes: HelpMode[] }
  | { kind: typeof HELP_BLOCK.terms; label: string; description?: string; rows: HelpTerm[] };

export type HelpDoc = {
  slug: string;
  category: HelpCategory;
  title: string;
  lead?: ReactNode;
  blocks: HelpBlock[];
  related: string[];
};

export const HELP_DOCS: HelpDoc[] = [
  {
    slug: "find-and-join",
    category: HELP_CATEGORY.join,
    title: "구인 찾고 신청하기",
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "신청할 수 있는 구인을 고릅니다",
            body: (
              <>
                "모집 중"·"대기 접수 중" 구인에 신청할 수 있습니다.
                <br />
                검색창에 게임명이나 룰을 넣어 찾습니다.
                <br />
                상태 칩은 모집 상태로 거르고, 정렬은 순서를 바꿉니다.
              </>
            ),
            figure: HELP_FIGURE.gameList,
          },
          {
            title: "상세에서 조건을 확인하고 신청합니다",
            body: (
              <>
                위쪽에 룰, 플레이타임, 마감일, 세션 일정이 있습니다.
                <br />
                정원과 참여자 명단은 아래쪽에 있습니다.
                <br />
                맨 아래 "신청하기"를 누르면 신청됩니다.
              </>
            ),
          },
          {
            title: "결과를 기다립니다",
            body: (
              <>
                선착순은 자리가 남아 있으면 바로 확정됩니다.
                <br />
                추첨은 GM이 추첨한 뒤 디스코드로 결과를 알립니다.
              </>
            ),
            note: (
              <>
                "대기 접수 중"이면 대기 순번을 받을 수 있습니다.
                <br />
                자리가 나면 GM이 대기자를 확정으로 옮깁니다.
                <br />
                자동으로 확정되지는 않습니다.
              </>
            ),
          },
          {
            title: "신청을 취소합니다",
            body: (
              <>
                대기와 추첨 신청은 언제든 취소할 수 있습니다.
                <br />
                확정 후에는 정원이 차거나 마감되면 취소할 수 없습니다.
                <br />
                세션 시간이 정해진 뒤에도 마찬가지입니다.
                <br />
                이때는 GM에게 직접 연락해 주세요.
              </>
            ),
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
    lead: (
      <>
        모집 방식은 GM이 등록할 때 고릅니다.
        <br />
        신청자가 생기면 방식을 바꿀 수 없습니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.modes,
        modes: [
          {
            method: RECRUIT_METHOD.firstCome,
            summary: "신청한 순서대로 바로 확정",
            steps: [
              {
                title: "신청하면 바로 결과가 나옵니다",
                body: "자리가 남아 있으면 즉시 확정됩니다.",
              },
              {
                title: "정원이 차면 신청이 닫힙니다",
                body: "대기 접수를 연 구인만 대기로 받습니다.",
              },
            ],
          },
          {
            method: RECRUIT_METHOD.lottery,
            summary: "모아서 한 번에 뽑기",
            steps: [
              {
                title: "누구나 신청할 수 있습니다",
                body: "최대 100명이며, 신청 시점에는 접수만 됩니다.",
              },
              {
                title: 'GM이 "추첨하기"를 누릅니다',
                body: "마감일 전이라도 이때 모집이 마감됩니다.",
              },
              { title: "모두 1d100을 굴립니다", body: "낮은 숫자부터 정원만큼 확정됩니다." },
              { title: "나머지는 대기 명단에 남습니다" },
            ],
            foot: (
              <>
                결과는 디스코드 모집 스레드에 올라옵니다.
                <br />
                내가 굴린 숫자는 추첨 결과 페이지에 있습니다.
              </>
            ),
          },
        ],
      },
      {
        kind: HELP_BLOCK.terms,
        label: "목록 카드에서 구분하기",
        rows: [
          { term: "선착순 · 확정 2 · 정원 4", description: "확정된 인원을 셉니다.", badge: true },
          { term: "추첨 · 신청 7 · 정원 4", description: "신청한 인원을 셉니다.", badge: true },
          {
            term: "추첨 · 정원 4",
            description: "마감되면 방식과 정원만 남습니다.",
            badge: true,
          },
        ],
      },
    ],
    related: ["status-glossary", "find-and-join"],
  },
  {
    slug: "schedule-grid",
    category: HELP_CATEGORY.join,
    title: "일정 조율 격자 쓰는 법",
    lead: (
      <>
        격자는 참여자들이 가능한 시간을 겹쳐서 보여줍니다.
        <br />
        색이 진할수록 그 시간에 가능한 사람이 많다는 뜻입니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "칸을 끌어서 칠합니다",
            body: (
              <>
                가로는 날짜, 세로는 시각을 의미합니다.
                <br />
                여러 칸이 한 번에 칠해지고, 칠한 칸을 다시 끌면 지워집니다.
              </>
            ),
            figure: HELP_FIGURE.heatGrid,
          },
          {
            title: "저장합니다",
            body: (
              <>
                칠한 뒤 아직 저장하지 않은 칸은 따로 표시됩니다.
                <br />
                화면 아래 저장을 누르면 다른 참여자에게도 반영됩니다.
              </>
            ),
          },
          {
            title: "확정을 기다립니다",
            body: (
              <>
                참여자들의 칸이 모이면 GM이 세션 시간을 정합니다.
                <br />
                정해진 시간은 홈 달력과 마이페이지 내 세션에 올라갑니다.
              </>
            ),
            note: (
              <>
                사정이 바뀌면 확정 전까지 다시 칠해도 됩니다.
                <br />
                늦게 고치면 GM이 일정을 다시 정해야 하니,
                <br />
                사정을 알게 되는 대로 고쳐 주세요.
              </>
            ),
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
    lead: (
      <>
        구인 목록 오른쪽 위 "새 구인"에서 시작합니다.
        <br />
        다섯 단계이며, 도중에 나가면 입력한 내용이 사라집니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "게임 정보",
            body: "게임명, 룰, 시놉시스, 플레이타임을 입력합니다.",
            figure: HELP_FIGURE.formFields,
          },
          {
            title: "참여 전 안내",
            body: (
              <>
                장르, 트리거, 플랫폼, 주의 사항을 적습니다.
                <br />
                AI 이미지 사용 여부는 꼭 골라야 합니다.
              </>
            ),
          },
          {
            title: "이미지",
            body: (
              <>
                썸네일 1장과 상세 이미지 5장까지 올립니다.
                <br />
                썸네일이 없으면 기본 배경이 들어갑니다.
              </>
            ),
          },
          {
            title: "모집 방법",
            body: (
              <>
                정원(최대 20명)과 모집 방식을 정합니다.
                <br />
                선착순이면 대기 접수 여부도 정합니다.
                <br />
                약속한 사람이 있으면 미리 확정해 둘 수 있습니다.
              </>
            ),
          },
          {
            title: "일정",
            body: (
              <>
                일정 조율과 일시 지정 중 하나를 고릅니다.
                <br />
                조율 기간이나 세션 시간, 모집 마감일을 정합니다.
              </>
            ),
            note: (
              <>
                등록한 뒤에도 모든 항목을 고칠 수 있습니다.
                <br />
                신청자가 있으면 <b>모집·일정 방식은 못 바꿉니다.</b>
                <br />
                정원은 확정 인원보다 줄일 수 없습니다.
                <br />
                일정을 바꾸면 디스코드로 알립니다.
              </>
            ),
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
    lead: '구인 상세 → "운영 관리" → "참여자 관리"로 들어갑니다.',
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "참여자를 정합니다",
            body: (
              <>
                추첨은 "추첨하기" 뒤에 "결과 확정하기"를 눌러야 합니다.
                <br />
                그래야 명단이 바뀌고 알림이 갑니다.
                <br />
                확정과 대기 명단 사이로 사람을 옮길 수 있습니다.
                <br />
                정원이 찼다면 확정자 한 명을 먼저 대기로 옮깁니다.
              </>
            ),
            figure: HELP_FIGURE.rosterRows,
          },
          {
            title: "일정을 모읍니다",
            body: "신청한 사람들이 격자에 가능한 시간을 칠합니다.",
          },
          {
            title: "세션 시간을 정합니다",
            body: (
              <>
                "세션 시간 정하기"에서 후보를 고르거나 직접 입력합니다.
                <br />
                정하면 디스코드 스레드와 홈 달력에 올라갑니다.
                <br />
                시작 1시간 전에 디스코드로 한 번 더 알립니다.
              </>
            ),
            note: (
              <>
                정원이 차면 확정자는 스스로 취소할 수 없습니다.
                <br />
                빠질 사람은 GM이 내보내고 대기자로 채웁니다.
                <br />
                이때 세션 시간은 그대로입니다.
              </>
            ),
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
    lead: '이름·소개·성향 키워드·링크는 "프로필 편집"에서 고칩니다.',
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "이름",
            body: "이름은 신청·참여자 목록과 디스코드 알림에 나옵니다.",
          },
          {
            title: "링크",
            body: (
              <>
                링크는 6개까지 추가할 수 있습니다.
                <br />
                아래 여덟 곳은 로고가 자동으로 붙습니다.
              </>
            ),
            figure: HELP_FIGURE.linkMarks,
          },
          {
            title: "기본 가능 시간",
            body: (
              <>
                마이페이지 "기본 가능 시간"에서 고칩니다.
                <br />
                신청하면 조율 기간 안의 해당 칸이 자동 저장됩니다.
              </>
            ),
            note: (
              <>
                프로필은 로그인하지 않아도 볼 수 있습니다.
                <br />
                최근 3개월 안에 불참하면 불참 이력이 표시됩니다.
              </>
            ),
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
    blocks: [
      {
        kind: HELP_BLOCK.terms,
        label: "배지",
        description: "구인의 현재 모집 상태를 나타냅니다.",
        rows: [
          {
            term: "모집 중",
            description: (
              <>
                마감 전이고 자리가 남아 있습니다.
                <br />
                추첨은 추첨 전까지 이 상태입니다.
              </>
            ),
            status: GAME_STATUS.recruiting,
          },
          {
            term: "대기 접수 중",
            description: "정원은 찼고 대기 신청을 받습니다.",
            status: GAME_STATUS.confirmed,
          },
          {
            term: "모집 마감",
            description: (
              <>
                마감일이 지났거나 대기 없이 정원이 찼습니다.
                <br />
                추첨은 추첨하는 즉시 바뀝니다.
              </>
            ),
            status: GAME_STATUS.closed,
          },
        ],
      },
      {
        kind: HELP_BLOCK.terms,
        label: "내 상태",
        description: "구인에서 내 위치를 나타냅니다.",
        rows: [
          { term: "신청", description: "추첨 결과를 기다립니다." },
          { term: "확정", description: "참여할 자리를 받았습니다." },
          { term: "대기", description: "순번을 받고 GM의 확정을 기다립니다." },
        ],
      },
      {
        kind: HELP_BLOCK.terms,
        label: "날짜 용어",
        rows: [
          {
            term: "모집 마감일",
            description: (
              <>
                신청이 닫히는 날입니다.
                <br />
                일정 조율 구인은 시간을 모으는 기한도 됩니다.
              </>
            ),
          },
          {
            term: "세션 시간",
            description: (
              <>
                일시 지정은 등록할 때 정해집니다.
                <br />
                일정 조율은 GM이 정해야 확정됩니다.
              </>
            ),
          },
        ],
      },
    ],
    related: ["recruit-methods", "find-and-join"],
  },
];
