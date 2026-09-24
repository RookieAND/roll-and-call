// fetch는 업로드 진행률을 주지 않아 XHR로 올린다.
export function putWithProgress(
  url: string,
  file: File,
  onProgress: (ratio: number) => void,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("content-type", file.type);
    request.setRequestHeader("x-upsert", "false");
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    request.onload = () => resolve(request.status);
    request.onerror = () => reject(new Error("upload failed"));
    request.send(file);
  });
}
