"use client";

export function DeleteGameButton({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!globalThis.confirm("이 구인을 삭제할까요?")) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-red-300 px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        삭제
      </button>
    </form>
  );
}
