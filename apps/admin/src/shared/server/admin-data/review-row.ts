export interface ReviewRow {
  id: string;
  createdAt: Date;
  authorNickname: string;
  gameId: string;
  gameTitle: string;
  gmNickname: string;
  firstLine: string;
  photoCount: number;
  badges: string[];
}
