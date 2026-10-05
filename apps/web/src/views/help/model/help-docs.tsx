import type { ReactNode } from "react";

import {
  GAME_STATUS,
  type GameStatus,
  MANAGE_STAGE,
  MANAGE_STAGE_LABEL,
  type ManageStage,
  RECRUIT_METHOD,
  type RecruitMethod,
} from "@/entities/game";

export const HELP_CATEGORY = {
  join: "참여하기",
  host: "GM으로 운영하기",
  account: "계정과 알림",
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
  body: string[];
  note?: ReactNode;
  figure?: HelpFigureKey;
};

export type HelpTerm = {
  term: string;
  description: ReactNode;
  status?: GameStatus;
  stage?: ManageStage;
  badge?: boolean;
  gm?: boolean;
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
  rowDescription?: ReactNode;
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
            body: [
              '"모집 중"·"대기 접수 중" 구인에 신청할 수 있습니다.',
              "검색창에 구인 제목이나 룰 이름을 넣어 찾습니다.",
              "[필터]에서 룰·요일·시간대로 좁힐 수 있습니다.",
              "상태 칩은 모집 상태로 거르고, 정렬은 순서를 바꿉니다.",
            ],
            figure: HELP_FIGURE.gameList,
          },
          {
            title: "상세에서 조건을 확인합니다",
            body: [
              "위쪽에 룰, 플레이타임, 마감, 세션 일정이 있습니다.",
              "정원과 참여자 명단은 아래쪽에 있습니다.",
              "참여 전 안내의 트리거와 주의 사항도 읽어 주세요.",
            ],
          },
          {
            title: "맨 아래 버튼으로 신청합니다",
            body: [
              "선착순은 [신청하기]를 누르면 바로 확정됩니다.",
              "정원이 찼으면 [대기로 신청하기]가 보입니다.",
              "추첨은 [신청하기]로 접수하고 마감 때 뽑습니다.",
              "결과는 알림 탭으로 알립니다.",
            ],
            note: (
              <>
                대기자는 저절로 확정되지 않습니다.
                <br />
                자리가 나면 GM이 대기 명단에서 확정합니다.
                <br />
                빈자리가 생기면 알림 탭으로 알립니다.
              </>
            ),
          },
        ],
      },
    ],
    related: ["recruit-methods", "cancel-participation"],
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
                body: "대기를 받는 구인만 대기로 받습니다.",
              },
              {
                title: "확정되면 바로 일정 조율에 참여합니다",
                body: "범위 조율 구인이면 곧바로 시간을 칠합니다.",
              },
            ],
          },
          {
            method: RECRUIT_METHOD.lottery,
            summary: "모아서 마감 때 한 번에 뽑기",
            steps: [
              {
                title: "마감 전까지 누구나 신청합니다",
                body: "최대 100명이며, 신청 시점에는 접수만 됩니다.",
              },
              {
                title: "마감 때 추첨합니다",
                body: "GM이 먼저 추첨하면 그때 모집이 마감됩니다.",
              },
              { title: "모두 1d100을 굴립니다", body: "낮은 숫자부터 정원만큼 확정됩니다." },
              {
                title: "나머지는 대기 명단에 남습니다",
                body: "자리가 나면 GM이 대기 명단에서 확정합니다.",
              },
              {
                title: "뽑힌 뒤에 일정 조율이 열립니다",
                body: "범위 조율 구인이면 그때부터 시간을 칠합니다.",
              },
            ],
            foot: (
              <>
                결과는 디스코드 구인 글과 알림 탭으로 알립니다.
                <br />
                내가 굴린 숫자는 추첨 결과 화면에 있습니다.
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
        격자는 참여자들이 가능한 시간을 겹쳐서 보여 줍니다.
        <br />
        색이 진할수록 그 시간에 되는 사람이 많습니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "칠할 수 있는지 확인합니다",
            body: [
              "GM과 확정 참여자만 칠할 수 있습니다.",
              "대기자와 추첨 전 신청자는 겹친 시간만 봅니다.",
              "추첨 구인은 추첨이 끝난 뒤에 칠합니다.",
              "일시가 정해진 구인은 칠할 필요가 없습니다.",
            ],
          },
          {
            title: "칸을 누르거나 끌어서 칠합니다",
            body: [
              "가로는 날짜, 세로는 시각입니다.",
              "칠한 칸을 다시 누르면 지워집니다.",
              "빗금 칸은 내가 확정된 다른 세션과 겹칩니다.",
            ],
            figure: HELP_FIGURE.heatGrid,
            note: (
              <>
                기본 가능 시간을 정해 두었다면 미리 칠해져 있습니다.
                <br />
                확인하고 저장해야 제출한 것으로 봅니다.
              </>
            ),
          },
          {
            title: "저장합니다",
            body: [
              "저장하지 않은 칸은 따로 표시됩니다.",
              "아래 [저장]을 누르면 다른 참여자에게도 보입니다.",
            ],
          },
          {
            title: "세션 시간이 정해질 때까지 고칠 수 있습니다",
            body: [
              "모집이 마감되어도 시간이 정해지기 전이면 고칠 수 있습니다.",
              "시간이 정해지면 격자 입력이 잠깁니다.",
              "정해진 시간은 알림 탭과 홈 달력에 올라갑니다.",
            ],
            note: (
              <>
                늦게 고치면 GM이 일정을 다시 정해야 합니다.
                <br />
                사정이 바뀌면 바로 고쳐 주세요.
              </>
            ),
          },
        ],
      },
    ],
    related: ["status-glossary", "manage-roster"],
  },
  {
    slug: "cancel-participation",
    category: HELP_CATEGORY.join,
    title: "참여를 취소하고 싶을 때",
    lead: (
      <>
        확정 뒤에는 다른 참여자의 일정이 걸려 있습니다.
        <br />
        그래서 직접 취소할 수 있는 때가 정해져 있습니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.terms,
        label: "내 상태별로 보기",
        description: "취소는 구인 상세 맨 아래 버튼에서 합니다.",
        rows: [
          {
            term: "대기",
            description: (
              <>
                세션이 끝나기 전까지 언제든 [대기 취소]를 할 수 있습니다.
                <br />
                다시 신청하면 맨 뒤 순번이 됩니다.
              </>
            ),
          },
          {
            term: "참여 신청(추첨)",
            description: (
              <>
                모집 마감 전까지만 [신청 취소]를 할 수 있습니다.
                <br />
                마감 전에는 언제든 다시 신청할 수 있습니다.
              </>
            ),
          },
          {
            term: "확정",
            description: (
              <>
                [참여 취소]로 자리를 내려놓을 수 있습니다.
                <br />
                다시 참여하려면 처음부터 신청해야 합니다.
                <br />
                GM에게는 알림 탭으로 알립니다.
              </>
            ),
          },
        ],
      },
      {
        kind: HELP_BLOCK.terms,
        label: "확정자가 직접 취소할 수 없을 때",
        description: "하나라도 해당하면 버튼 대신 안내가 보입니다.",
        rows: [
          {
            term: "일정이 정해짐",
            description: (
              <>
                범위 조율 구인은 세션 시간이 정해진 뒤부터입니다.
                <br />
                일시 지정 구인은 세션이 시작된 뒤부터입니다.
              </>
            ),
          },
          { term: "모집 마감", description: "마감일이 지났거나 추첨이 끝났습니다." },
          {
            term: "정원이 참",
            description: (
              <>
                대기자 없이 정원이 찼습니다.
                <br />
                대기자가 있으면 취소할 수 있습니다.
              </>
            ),
          },
        ],
      },
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "취소할 수 없다면 GM에게 문의합니다",
            body: [
              "GM은 참여자 관리에서 명단을 고칠 수 있습니다.",
              "세션이 시작된 뒤에 빠지면 불참으로 기록됩니다.",
            ],
          },
        ],
      },
    ],
    related: ["find-and-join", "after-session"],
  },
  {
    slug: "after-session",
    category: HELP_CATEGORY.join,
    title: "세션이 끝난 뒤: 출석과 후기",
    lead: (
      <>
        세션이 끝나면 GM이 출석을 확인합니다.
        <br />
        출석이 확정되면 참석한 사람은 후기를 쓸 수 있습니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "GM이 출석을 확인합니다",
            body: [
              "기본값은 전원 참석입니다.",
              "GM은 오지 않은 사람만 불참으로 바꿉니다.",
              "세션이 끝나고 7일이 지나면 그대로 확정됩니다.",
            ],
          },
          {
            title: "불참 기록을 확인합니다",
            body: [
              "불참으로 기록되면 알림 탭으로 알립니다.",
              "불참 기록은 세션 시작부터 30일 동안 프로필에 보입니다.",
              "횟수와 세션 이름은 보이지 않습니다.",
              "불참한 세션은 참여 횟수와 업적에서 빠집니다.",
              "1:1(타이만) 세션은 이 달의 기록 순위와 업적에 세지 않습니다.",
              "미니룰 세션은 업적에는 그대로 세고, 이 달의 기록 순위에서는 한 회차를 0.5회로 계산합니다.",
            ],
            note: (
              <>
                기록이 잘못되었다면 서버 운영진에게 문의해 주세요.
                <br />
                운영진이 확인한 뒤 기록을 취소할 수 있습니다.
              </>
            ),
          },
          {
            title: "후기를 씁니다",
            body: [
              "출석이 확정되면 알림 탭으로 알립니다.",
              "참석한 사람만 14일 안에 쓸 수 있습니다.",
              "구인 상세나 내 세션에서 [후기 쓰기]를 누릅니다.",
              "본문은 20자 이상이고, 사진은 5장까지 올립니다.",
            ],
            note: (
              <>
                후기는 세션마다 하나만 쓸 수 있습니다.
                <br />
                지우면 같은 세션에 다시 쓸 수 없습니다.
                <br />
                고치는 것은 등록하고 14일까지 할 수 있습니다.
              </>
            ),
          },
          {
            title: "누가 보는지 알아 둡니다",
            body: [
              "후기는 로그인하지 않은 사람도 볼 수 있습니다.",
              'GM 프로필의 "진행한 세션 후기"에 모입니다.',
              '스포일러가 있으면 "스포일러 포함"을 켜 주세요.',
            ],
          },
        ],
      },
    ],
    related: ["cancel-participation", "profile-links"],
  },
  {
    slug: "rulebook-cert",
    category: HELP_CATEGORY.host,
    title: "GM이 되려면: 룰북 인증",
    lead: (
      <>
        "인증 필요" 룰로 구인을 열려면 룰북을 인증해야 합니다.
        <br />
        "인증 불필요" 룰은 누구나 바로 열 수 있습니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "인증할 책을 고릅니다",
            body: [
              "마이페이지 [룰북 인증하기]에서 시작합니다.",
              "그 판본의 기본 룰북을 모두 인증해야 합니다.",
              "서플리먼트는 기본 룰북을 인증한 뒤에 신청합니다.",
            ],
            note: "찾는 룰북이 없으면 [+ 추가 요청]을 눌러 주세요.",
          },
          {
            title: "증빙을 올립니다",
            body: [
              "실물 책은 앞면·뒷면·책등 사진 3장을 올립니다.",
              "앞면은 디스코드 닉네임을 적은 쪽지와 함께 찍습니다.",
              "전자책은 구매 내역과 영수증을 올립니다.",
            ],
            note: (
              <>
                증빙 사진은 운영진만 봅니다.
                <br />
                심사가 끝나고 30일 뒤 지워집니다.
              </>
            ),
          },
          {
            title: "본문 퀴즈에 답합니다",
            body: [
              "퀴즈가 있는 책만 이 단계가 있습니다.",
              "책을 가지고 있다면 쉽게 답할 수 있습니다.",
              "틀려도 다시 답할 수 있습니다.",
            ],
          },
          {
            title: "결과를 기다립니다",
            body: [
              "운영진이 책마다 승인하거나 반려합니다.",
              "결과는 알림 탭으로 알립니다.",
              "반려되면 사유를 확인하고 다시 신청할 수 있습니다.",
            ],
            note: (
              <>
                인증은 서버마다 따로 받습니다.
                <br />
                다른 서버에서 받은 인증은 넘어오지 않습니다.
              </>
            ),
          },
        ],
      },
    ],
    related: ["create-game", "profile-links"],
  },
  {
    slug: "create-game",
    category: HELP_CATEGORY.host,
    title: "구인 등록하기",
    lead: (
      <>
        구인 목록 오른쪽 위 [+ 새 구인]에서 시작합니다.
        <br />
        다섯 단계이며, 도중에 나가면 입력한 내용이 사라집니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "구인 정보",
            body: [
              "제목, 룰, 플레이타임, 시놉시스를 적습니다.",
              "인증이 필요한 룰은 인증을 마쳐야 고를 수 있습니다.",
            ],
            figure: HELP_FIGURE.formFields,
          },
          {
            title: "참여 전 안내",
            body: [
              "장르, 트리거, 플랫폼, 주의 사항을 적습니다.",
              "AI 이미지 사용 여부는 꼭 골라야 합니다.",
            ],
          },
          {
            title: "이미지",
            body: [
              "썸네일 1장과 상세 이미지 5장까지 올립니다.",
              '스포일러가 있으면 "스포일러 주의"를 켭니다.',
              "이미지는 나중에 올려도 됩니다.",
            ],
          },
          {
            title: "모집 방법",
            body: [
              "정원(최대 20명)과 모집 방식을 정합니다.",
              "선착순이면 대기를 받을지도 정합니다.",
              "약속한 사람이 있으면 미리 확정해 둘 수 있습니다.",
            ],
          },
          {
            title: "일정",
            body: [
              "범위 조율과 일시 지정 중 하나를 고릅니다.",
              "범위 조율은 조율 기간을 14일까지 잡을 수 있습니다.",
              "모집 마감은 세션 시작보다 앞이어야 합니다.",
            ],
            note: (
              <>
                등록한 뒤에는 운영 관리의 "구인 수정"에서 고칩니다.
                <br />
                룰은 등록한 뒤 바꿀 수 없습니다.
                <br />
                <strong>신청자가 있으면 모집·일정 방식은 바꿀 수 없습니다.</strong>
                <br />
                세션이 시작되면 고치거나 취소할 수 없습니다.
              </>
            ),
          },
        ],
      },
    ],
    related: ["rulebook-cert", "manage-roster"],
  },
  {
    slug: "manage-roster",
    category: HELP_CATEGORY.host,
    title: "참여자 관리와 세션 운영",
    lead: (
      <>
        구인 상세 → [운영 관리]에서 시작합니다.
        <br />
        할 일이 생기면 알림 탭 [할 일]에도 올라옵니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "참여자를 정합니다",
            body: [
              "추첨 글은 마감 때 추첨합니다.",
              "기다리지 않으려면 [지금 추첨하기]를 눌러 주세요.",
              "결과는 디스코드 구인 글과 알림 탭으로 알립니다.",
              '"참여자 관리"에서 확정과 대기 사이로 사람을 옮깁니다.',
            ],
            figure: HELP_FIGURE.rosterRows,
            note: (
              <>
                자리가 나도 대기자는 저절로 확정되지 않습니다.
                <br />
                대기 명단에서 [참여자로 등록]을 눌러 주세요.
              </>
            ),
          },
          {
            title: "세션 시간을 정합니다",
            body: [
              "범위 조율 구인은 참여자들이 격자에 시간을 칠합니다.",
              '"세션 시간 정하기"에서 추천 후보를 고르거나 직접 고릅니다.',
              "정하면 디스코드 구인 글과 알림 탭으로 알립니다.",
              "시작 1시간 전에 디스코드 구인 글로 한 번 더 알립니다.",
            ],
            note: "조율이 끝나고 7일 안에 정하지 않으면 무산됩니다.",
          },
          {
            title: "세션 중 빈자리를 채웁니다",
            body: [
              "참여자 관리는 세션이 끝날 때까지 열려 있습니다.",
              "오지 않은 사람은 [불참으로 내보내기]로 뺍니다.",
              "급히 사람을 더하려면 [+ 참여자 추가]를 누릅니다.",
            ],
            note: "세션이 시작된 뒤에는 정원을 한 번만 1명 늘릴 수 있습니다.",
          },
          {
            title: "세션을 마칩니다",
            body: [
              '세션이 예정보다 일찍 끝나면 운영 관리의 "출석 확인"을 눌러 주세요.',
              "세션을 마칠지 묻는 창에서 [마치기]를 눌러 주세요.",
              "참여자 관리가 닫히고 바로 출석 확인으로 넘어갑니다.",
            ],
            note: "실수로 마쳤다면 잠시 뜨는 [되돌리기]를 눌러 주세요.",
          },
          {
            title: "출석을 확인합니다",
            body: [
              "기본값은 전원 참석입니다.",
              "오지 않은 사람만 불참으로 바꾸고 확정합니다.",
              "세션이 끝나고 7일 안에는 다시 고칠 수 있습니다.",
            ],
            note: (
              <>
                7일이 지나면 그대로 확정됩니다.
                <br />그 뒤에 고쳐야 하면 서버 운영진에게 요청해 주세요.
              </>
            ),
          },
        ],
      },
    ],
    related: ["create-game", "after-session"],
  },
  {
    slug: "notifications",
    category: HELP_CATEGORY.account,
    title: "알림 받기",
    rowDescription: (
      <>
        할 일과 받은 알림을 탭으로 나눠 봅니다.
        <br />
        할 일이 있으면 홈 맨 위에 배너로 알립니다.
      </>
    ),
    lead: (
      <>
        롤앤콜의 알림은 알림 탭과 디스코드 구인 글로 옵니다.
        <br />
        디스코드 DM은 보내지 않습니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "[할 일]에서 처리할 일을 봅니다",
            body: [
              "내가 처리해야 하는 일이 모여 있습니다.",
              "처리하면 목록에서 사라집니다.",
              "할 일이 있으면 홈 맨 위에 배너가 뜹니다.",
            ],
          },
          {
            title: "[알림]에서 받은 소식을 봅니다",
            body: [
              "추첨 결과, 세션 시간, 불참 기록 같은 소식이 쌓입니다.",
              "받은 알림은 7일 동안 보관합니다.",
              "안 읽은 알림이 있으면 알림 탭에 빨간 점이 뜹니다.",
            ],
          },
          {
            title: "디스코드 구인 글도 함께 봅니다",
            body: [
              "구인마다 디스코드에 글이 하나 열립니다.",
              "명단 변화, 추첨 결과, 세션 시간이 올라옵니다.",
              "시작 1시간 전에는 GM과 확정 참여자를 부릅니다.",
            ],
          },
          {
            title: "세션을 캘린더에 넣어 둡니다",
            body: [
              "세션 시간이 정해지면 [캘린더에 추가]가 보입니다.",
              "구인 상세 맨 아래에 있습니다.",
              "구글 캘린더나 iCloud 캘린더에 넣을 수 있습니다.",
            ],
            note: "시간이 바뀌면 캘린더 일정은 직접 고쳐 주세요.",
          },
        ],
      },
      {
        kind: HELP_BLOCK.terms,
        label: "할 일 종류",
        description: "위에 있을수록 먼저 처리할 일입니다.",
        rows: [
          {
            term: "세션 일시 미정",
            description: "조율이 끝났으니 세션 시간을 정해 주세요.",
            gm: true,
          },
          { term: "출석 미확인", description: "끝난 세션의 출석을 확인해 주세요.", gm: true },
          { term: "빈자리 생김", description: "대기자를 참여자로 등록할 수 있습니다.", gm: true },
          { term: "가능 시간 미제출", description: "일정 조율 격자를 칠하고 저장해 주세요." },
          { term: "인증 반려", description: "반려 사유를 보고 다시 신청할 수 있습니다." },
        ],
      },
    ],
    related: ["find-and-join", "manage-roster"],
  },
  {
    slug: "profile-links",
    category: HELP_CATEGORY.account,
    title: "프로필과 업적",
    lead: (
      <>
        프로필은 디스코드 서버마다 따로 만듭니다.
        <br />
        다른 서버의 프로필은 가져오지 않습니다.
      </>
    ),
    blocks: [
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "닉네임과 소개",
            body: [
              "닉네임은 처음에 디스코드 서버 닉네임으로 채워집니다.",
              "닉네임은 신청·참여자 목록과 알림에 나옵니다.",
              "한 줄 소개와 성향 키워드 3개를 적을 수 있습니다.",
            ],
          },
          {
            title: "링크",
            body: [
              "링크는 6개까지 추가할 수 있습니다.",
              "아래 여덟 곳은 로고가 자동으로 붙습니다.",
            ],
            figure: HELP_FIGURE.linkMarks,
          },
          {
            title: "기본 가능 시간",
            body: [
              '마이페이지 "기본 가능 시간"에서 고칩니다.',
              "일정 조율에 참여하게 되면 이 시간이 미리 칠해집니다.",
            ],
          },
          {
            title: "업적",
            body: [
              "세션에 참여하고 운영할수록 뱃지가 쌓입니다.",
              "출석이 확정된 세션만 셉니다.",
              '숨겨진 칭호는 받기 전까지 "???"로 보입니다.',
              "대표 뱃지 3개를 골라 프로필에 보일 수 있습니다.",
            ],
            note: (
              <>
                이달의 GM과 이달의 PL은 다음 달 8일에 정해집니다.
                <br />
                마이페이지 설정에서 업적을 숨길 수도 있습니다.
                <br />
                1:1(타이만) 세션은 업적에 세지 않습니다.
              </>
            ),
          },
          {
            title: "다른 사람에게 보이는 것",
            body: [
              "프로필은 로그인하지 않아도 볼 수 있습니다.",
              "최근 30일 안에 불참하면 불참 기록이 표시됩니다.",
              "개인 메모는 나만 보고, 상대에게 알리지 않습니다.",
            ],
          },
        ],
      },
    ],
    related: ["after-session", "schedule-grid"],
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
                추첨 글은 추첨 전까지 이 상태입니다.
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
                추첨 글은 GM이 먼저 추첨해도 바로 바뀝니다.
              </>
            ),
            status: GAME_STATUS.closed,
          },
          {
            term: "일정 확정",
            description: (
              <>
                범위 조율 구인의 세션 시간이 정해졌습니다.
                <br />더 이상 신청을 받지 않습니다.
              </>
            ),
            status: GAME_STATUS.scheduled,
          },
          {
            term: "취소됨",
            description: (
              <>
                GM이나 운영진이 취소한 구인입니다.
                <br />
                지우지 않고 기록으로 남깁니다.
              </>
            ),
            status: GAME_STATUS.cancelled,
          },
        ],
      },
      {
        kind: HELP_BLOCK.terms,
        label: "내 상태",
        description: "구인에서 내 위치를 나타냅니다.",
        rows: [
          { term: "참여 신청", description: "추첨 결과를 기다립니다." },
          { term: "확정", description: "참여할 자리를 받았습니다." },
          { term: "대기", description: "순번을 받고 GM의 확정을 기다립니다." },
          { term: "불참", description: "세션에 오지 않은 것으로 기록되었습니다." },
        ],
      },
      {
        kind: HELP_BLOCK.terms,
        label: "운영 단계",
        description: "GM의 운영 관리 화면에 보입니다.",
        rows: [
          {
            term: MANAGE_STAGE_LABEL.beforeDraw,
            description: "추첨 글의 모집이 아직 진행 중입니다.",
            stage: MANAGE_STAGE.beforeDraw,
          },
          {
            term: MANAGE_STAGE_LABEL.coordinating,
            description: "참여자들이 가능한 시간을 칠하고 있습니다.",
            stage: MANAGE_STAGE.coordinating,
          },
          {
            term: MANAGE_STAGE_LABEL.overdue,
            description: (
              <>
                조율 기간이 끝났지만 세션 시간이 없습니다.
                <br />
                7일이 더 지나면 구인이 무산됩니다.
              </>
            ),
            stage: MANAGE_STAGE.overdue,
          },
          {
            term: MANAGE_STAGE_LABEL.confirmed,
            description: "세션 시간이 정해졌습니다.",
            stage: MANAGE_STAGE.confirmed,
          },
          {
            term: MANAGE_STAGE_LABEL.inProgress,
            description: "세션이 시작되었고 아직 끝나지 않았습니다.",
            stage: MANAGE_STAGE.inProgress,
          },
          {
            term: MANAGE_STAGE_LABEL.ended,
            description: "세션이 끝났습니다.",
            stage: MANAGE_STAGE.ended,
          },
        ],
      },
      {
        kind: HELP_BLOCK.terms,
        label: "날짜 용어",
        rows: [
          {
            term: "모집 마감",
            description: (
              <>
                신청이 닫히는 때입니다.
                <br />
                추첨 글은 이때 추첨합니다.
              </>
            ),
          },
          {
            term: "조율 기간",
            description: (
              <>
                가능 시간을 모으는 날짜 범위입니다.
                <br />
                범위 조율 구인에만 있습니다.
              </>
            ),
          },
          {
            term: "세션 시간",
            description: (
              <>
                일시 지정 구인은 등록할 때 정해집니다.
                <br />
                범위 조율 구인은 GM이 정해야 확정됩니다.
              </>
            ),
          },
        ],
      },
    ],
    related: ["recruit-methods", "cancel-participation"],
  },
  {
    slug: "monthly-score",
    category: HELP_CATEGORY.account,
    title: "이 달의 기록 순위는 어떻게 정해지나요?",
    blocks: [
      {
        kind: HELP_BLOCK.terms,
        label: "점수표",
        rows: [
          { term: "정식 세션", description: "100점" },
          { term: "미니룰 세션", description: "50점" },
          { term: "타이만 세션", description: "15점" },
        ],
      },
      {
        kind: HELP_BLOCK.steps,
        steps: [
          {
            title: "다인원 가점",
            body: [
              "GM에게만 더해집니다.",
              "참석한 플레이어가 3명을 넘으면 1명마다 정식 +20점, 미니룰 +10점이고 플레이어 6명까지 셉니다.",
            ],
          },
          {
            title: "후기 점수",
            body: [
              "플레이어가 공개한 후기 1건마다 10점입니다.",
              "공백을 뺀 10자 이상이어야 하고, 처음 공개한 달에 셉니다.",
              "후기를 숨기거나 지우면 점수도 빠집니다.",
            ],
          },
          {
            title: "불참 감점",
            body: [
              "불참으로 기록되면 세션 종류와 상관없이 1건마다 100점을 뺍니다.",
              "플레이어 점수와 GM 점수에서 각각 빠지고, 불참 기록이 취소되면 돌아옵니다.",
            ],
            note: "0점 이하는 순위에 오르지 않습니다.",
          },
        ],
      },
    ],
    related: [],
  },
];
