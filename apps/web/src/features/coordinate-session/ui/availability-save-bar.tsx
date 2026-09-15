import { Button, Text } from "@trpg/ui";

export function AvailabilitySaveBar({
  selectedCount,
  unsavedCount,
  dirty,
  pending,
  onReset,
  onSave,
}: {
  selectedCount: number;
  unsavedCount: number;
  dirty: boolean;
  pending: boolean;
  onReset: () => void;
  onSave: () => void;
}) {
  const status = dirty ? `저장하지 않음 ${unsavedCount}칸` : "모두 저장됨";
  const statusClass = dirty ? "font-semibold text-warning-600" : "text-hint";

  return (
    <div className="sticky bottom-0 z-10 -mx-4 flex items-center gap-2 border-t border-gray-200 bg-surface px-4 py-3">
      <Text typography="body3" render={<p />} className="min-w-0 flex-1 tabular-nums">
        선택 {selectedCount}칸 · <span className={statusClass}>{status}</span>
      </Text>
      {dirty && (
        <Button variant="ghost" size="sm" className="h-10 shrink-0" onClick={onReset}>
          되돌리기
        </Button>
      )}
      <Button
        type="button"
        className="h-11 shrink-0 px-6"
        loading={pending}
        disabled={!dirty}
        onClick={onSave}
      >
        저장
      </Button>
    </div>
  );
}
