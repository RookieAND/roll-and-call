import { Card, Collapsible, HStack, Text } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";

import type { FeaturedChoice } from "../model/featured-choice";
import { FeaturedPickRow } from "./featured-pick-row";

interface FeaturedGroupCardProps {
  emoji: string;
  title: string;
  choices: FeaturedChoice[];
  picked: string[];
  full: boolean;
  defaultOpen: boolean;
  onToggle: (key: string) => void;
}

export function FeaturedGroupCard({
  emoji,
  title,
  choices,
  picked,
  full,
  defaultOpen,
  onToggle,
}: FeaturedGroupCardProps) {
  return (
    <Card.Root padding="none" className="overflow-hidden">
      <Collapsible.Root defaultOpen={defaultOpen}>
        <Collapsible.Trigger className="group flex min-h-[52px] w-full cursor-pointer items-center gap-150 bg-gray-50 px-175 py-100 text-left">
          <span
            aria-hidden
            className="flex size-9 flex-none items-center justify-center rounded-400 bg-surface text-subtitle1"
          >
            {emoji}
          </span>
          <HStack align="baseline" gap="100" className="min-w-0 flex-1">
            <Text typography="subtitle2" weight="extrabold" className="flex-1">
              {title}
            </Text>
            <Text typography="body4" foreground="hint" numeric>
              {choices.length}개
            </Text>
          </HStack>
          <ChevronDown
            size={18}
            aria-hidden
            className="flex-none text-hint transition-transform group-data-panel-open:rotate-180"
          />
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <div className="border-t border-gray-200">
            {choices.map((choice) => {
              const order = picked.indexOf(choice.key);
              return (
                <FeaturedPickRow
                  key={choice.key}
                  choice={choice}
                  order={order}
                  disabled={full && order < 0}
                  onToggle={() => onToggle(choice.key)}
                />
              );
            })}
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Card.Root>
  );
}
