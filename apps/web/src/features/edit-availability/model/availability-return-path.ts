// 마이페이지에서 들어왔으면 마이페이지로, 그 밖(프로필 편집)은 프로필 편집으로 돌아간다(R19). from은 me만 받는다.
export const AVAILABILITY_FROM_ME = "me";

export function availabilityReturnPath(from: string | undefined): "/me" | "/me/edit" {
  return from === AVAILABILITY_FROM_ME ? "/me" : "/me/edit";
}
