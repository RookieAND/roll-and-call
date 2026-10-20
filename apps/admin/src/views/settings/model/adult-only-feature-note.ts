export function adultOnlyFeatureNote(enabled: boolean) {
  return enabled
    ? "[변경 저장]을 누른 뒤부터 새 구인에 성인 전용 선택이 나타납니다. 이미 올라간 구인은 바뀌지 않습니다."
    : "[변경 저장]을 누른 뒤부터 새 구인에 성인 전용 선택이 사라집니다. 이미 성인 전용으로 올린 구인의 태그는 그대로 남습니다.";
}
