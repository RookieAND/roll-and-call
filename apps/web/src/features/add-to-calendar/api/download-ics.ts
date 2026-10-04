// 받을 수 없으면(404 등) 던진다. 부르는 쪽이 시트 안에 실패를 보인다.
export async function downloadIcs({ url, fileName }: { url: string; fileName: string }) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`calendar.ics ${response.status}`);
  const blobUrl = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(blobUrl);
}
