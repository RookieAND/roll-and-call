"use client";

import type { RulebookDetail } from "@/entities/rulebook/server";

import type { RulebookEditFormState } from "../model/use-rulebook-edit-form";
import { FreeImpactDialog } from "./free-impact-dialog";
import { HideRulebookDialog } from "./hide-rulebook-dialog";
import { ImpactDialog } from "./impact-dialog";
import { KindImpactDialog } from "./kind-impact-dialog";

interface RulebookEditDialogsProps {
  rulebook: RulebookDetail;
  viewerId: string;
  form: RulebookEditFormState;
}

export function RulebookEditDialogs({ rulebook, viewerId, form }: RulebookEditDialogsProps) {
  return (
    <>
      <ImpactDialog
        rulebookLabel={rulebook.label}
        cases={form.impact}
        pending={form.saving.pending}
        networkError={form.saving.networkError}
        onConfirm={() => void form.persist()}
        onClose={() => form.setImpact([])}
      />
      <KindImpactDialog
        rulebookId={rulebook.id}
        rulebookLabel={rulebook.label}
        fromKind={form.saved.kind}
        toKind={form.next.kind}
        initial={form.kindImpact}
        pending={form.saving.pending}
        networkError={form.saving.networkError}
        onConfirm={() => void form.persist()}
        onClose={() => form.setKindImpact(null)}
      />
      <FreeImpactDialog
        open={form.confirmingFree}
        rulebookLabel={rulebook.label}
        certifiedCount={form.certifiedCount}
        pendingApplicationCount={rulebook.pendingApplicationCount}
        pending={form.saving.pending}
        networkError={form.saving.networkError}
        onConfirm={() => void form.persist()}
        onClose={() => form.setConfirmingFree(false)}
      />
      <HideRulebookDialog
        open={form.hiding}
        rulebookId={rulebook.id}
        rulebookLabel={rulebook.label}
        certifiedCount={form.certifiedCount}
        pendingApplicationCount={rulebook.pendingApplicationCount}
        viewerId={viewerId}
        onClose={() => form.setHiding(false)}
      />
    </>
  );
}
