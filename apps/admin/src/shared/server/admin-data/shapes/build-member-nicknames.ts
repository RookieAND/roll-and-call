import type { MemberNickname } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildMemberNicknames({ tables }: ShapeContext): MemberNickname[] {
  return tables.profileRows.map((profile) => ({ id: profile.id, nickname: profile.nickname }));
}
