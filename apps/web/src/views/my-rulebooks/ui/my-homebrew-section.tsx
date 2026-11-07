import { listMyHomebrewApplications } from "@roll-and-call/database/homebrew";
import { Card } from "@roll-and-call/ui";

import { sortMyHomebrew } from "../model/sort-my-homebrew";
import { MyHomebrewFrame } from "./my-homebrew-frame";
import { MyHomebrewRow } from "./my-homebrew-row";

interface MyHomebrewSectionProps {
  serverId: string;
  userId: string;
}

export async function MyHomebrewSection({ serverId, userId }: MyHomebrewSectionProps) {
  const applications = await listMyHomebrewApplications({ serverId, userId });
  if (applications.length === 0) return null;
  return (
    <MyHomebrewFrame>
      <Card.Root padding="none" className="overflow-hidden">
        {sortMyHomebrew(applications).map((application) => (
          <MyHomebrewRow key={application.id} application={application} />
        ))}
      </Card.Root>
    </MyHomebrewFrame>
  );
}
