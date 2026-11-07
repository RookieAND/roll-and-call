import { loadHelpQuestEntry } from "../api/load-help-quest-entry";
import { HelpQuestCard } from "./help-quest-card";

interface HelpQuestEntryProps {
  from: string | null;
}

export async function HelpQuestEntry({ from }: HelpQuestEntryProps) {
  const entry = await loadHelpQuestEntry(from);
  return <HelpQuestCard href={entry.href} progress={entry.progress} />;
}
