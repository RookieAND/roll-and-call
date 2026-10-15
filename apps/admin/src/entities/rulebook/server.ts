// 서버에서만 부르는 진입점(스냅숏·DB를 읽는다). 클라이언트가 가져오는 index와 나눈다.
export { getKindImpact, type KindImpactPage } from "./api/get-kind-impact";
export {
  getRulebookDetail,
  type CertifiedGm,
  type RulebookDetail,
} from "./api/get-rulebook-detail";
export { getRulebookImpact, type RulebookImpactCase } from "./api/get-rulebook-impact";
export { listCertSellers, type CertSellerRow } from "./api/list-cert-sellers";
export {
  listRulebookRequests,
  type RequestGame,
  type RulebookRequestRow,
} from "./api/list-rulebook-requests";
export { listRulebooks, type RulebookCategory, type RulebookRow } from "./api/list-rulebooks";
