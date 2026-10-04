"use client";

import { Dialog } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useRouter } from "next/navigation";

import type { NoShowSessionSearch } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

import { AddNoShowForm } from "./add-no-show-form";

interface AddNoShowDialogProps {
  search: NoShowSessionSearch | null;
  closeHref: string;
}

// ?add=1로 연다. 추가하면 목록 주소에 ?pin={id}를 붙여 새 행을 맨 위에 보인다.
export function AddNoShowDialog({ search, closeHref }: AddNoShowDialogProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const close = () => router.replace(toServerPath(closeHref), { scroll: false });
  const showAdded = (id: string) => {
    const url = new URL(closeHref, "http://admin.local");
    url.searchParams.delete("page");
    url.searchParams.set("pin", id);
    router.replace(toServerPath(`${url.pathname}${url.search}`), { scroll: false });
  };

  return (
    <Dialog.Root open={!isNull(search)} onOpenChange={(open) => open || close()}>
      <Dialog.Popup size="lg" className="max-w-[560px]">
        {search ? <AddNoShowForm search={search} onClose={close} onAdded={showAdded} /> : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
