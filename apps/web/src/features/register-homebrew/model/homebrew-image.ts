// key가 null이면 아직 올리는 중이다. key는 uploadCertPhoto가 돌려준 공개 URL 모양 문자열이다.
export interface HomebrewImage {
  id: string;
  key: string | null;
  previewUrl: string;
  progress: number;
}
