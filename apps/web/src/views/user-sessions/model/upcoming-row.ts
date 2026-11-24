export interface UpcomingRow {
  id: string;
  title: string;
  rule: string;
  roundCount: number;
  startsAt: Date | null;
  endsAt: Date | null;
  recruiting: boolean;
  thumbnailUrl: string | null;
  thumbnailSpoiler: boolean;
}

export type DatedUpcomingRow = UpcomingRow & { startsAt: Date };
