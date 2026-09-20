import { EmptyProfileMemoCard } from "./empty-profile-memo-card";
import { ProfileMemoCard } from "./profile-memo-card";

interface ProfileMemoBlockProps {
  targetId: string;
  targetName: string;
  memo: { body: string; updatedAt: Date } | null;
}

export function ProfileMemoBlock({ targetId, targetName, memo }: ProfileMemoBlockProps) {
  return (
    <div className="px-200 pb-200">
      {memo ? (
        <ProfileMemoCard targetId={targetId} targetName={targetName} body={memo.body} />
      ) : (
        <EmptyProfileMemoCard targetId={targetId} targetName={targetName} />
      )}
    </div>
  );
}
