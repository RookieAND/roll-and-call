import "server-only";

// 한쪽(할 일·받은 알림) 실패가 다른 쪽을 막지 않게, 실패는 null로 넘겨 그 구역만 오류로 그린다.
export async function nullOnError<Value>(promise: Promise<Value>): Promise<Value | null> {
  try {
    return await promise;
  } catch (error) {
    console.error(error);
    return null;
  }
}
