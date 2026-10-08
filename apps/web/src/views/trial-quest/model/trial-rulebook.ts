import { RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

export const TRIAL_RULEBOOK_TITLE = "[연습] 체험용 룰북";
export const TRIAL_RULEBOOK_META = "CoC 7th";
export const TRIAL_NICKNAME = "체험 플레이어";
export const TRIAL_SELLERS = ["알라딘", "교보문고", "YES24"];

// 인증이 필요한 체험용 룰북 한 권. 코드 상수이고 DB에 두지 않는다.
export const TRIAL_RULEBOOK: MyRulebook = {
  id: "trial-rulebook",
  name: TRIAL_RULEBOOK_TITLE,
  edition: "7th",
  aliases: [],
  label: TRIAL_RULEBOOK_TITLE,
  shortName: TRIAL_RULEBOOK_TITLE,
  certRequired: true,
  kind: RULEBOOK_KIND.core,
  categoryId: "trial-category",
  categoryName: "CoC",
  supersedesId: null,
  state: null,
  stateAt: null,
  latestApplication: null,
  rejection: null,
  unlockedBy: null,
};
