import {
  defaultMessageText,
  getMessageTexts,
  type MessageTextKey,
  renderMessageHead,
} from "@roll-and-call/database/servers";

// 서버가 정한 임베드 설명 문장에 변수 값을 채운다. 비어 버리면 기본 문장을 쓴다.
export async function messageText({
  serverId,
  key,
  values,
}: {
  serverId: string;
  key: MessageTextKey;
  values: Record<string, string | undefined>;
}): Promise<string> {
  const texts = await getMessageTexts({ serverId });
  return (
    renderMessageHead({ template: texts[key].body, values }) ||
    renderMessageHead({ template: defaultMessageText(key), values })
  );
}
