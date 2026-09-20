import { Text, VStack } from "@trpg/ui";

import { HELP_BLOCK, type HelpBlock } from "../model/help-docs";

export function HelpDocBlock({ block }: { block: HelpBlock }) {
  if (block.kind === HELP_BLOCK.note) {
    return (
      <div className="border-l-2 border-tinted-border pl-3">
        <Text typography="body3" foreground="muted" render={<p />}>
          {block.body}
        </Text>
      </div>
    );
  }

  if (block.kind === HELP_BLOCK.rows) {
    return (
      <section>
        <Text typography="subtitle2" foreground="muted" render={<h3 />} className="mb-2">
          {block.label}
        </Text>
        <div className="overflow-hidden rounded-[14px] border border-gray-200">
          {block.rows.map((row) => (
            <div
              key={row.term}
              className="flex gap-3 border-gray-100 px-[13px] py-2.5 not-first:border-t"
            >
              <Text typography="subtitle1" className="w-[92px] flex-none">
                {row.term}
              </Text>
              <Text typography="body3" foreground="muted" className="min-w-0 flex-1">
                {row.description}
              </Text>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <VStack gap={4}>
      {block.steps.map((step, index) => (
        <div key={step.title} className="flex gap-3">
          <div className="flex flex-none flex-col items-center">
            <Text
              typography="subtitle2"
              render={<span />}
              className="flex size-[26px] items-center justify-center rounded-[9px] bg-primary-600 text-white tabular-nums"
            >
              {index + 1}
            </Text>
            {index < block.steps.length - 1 && <span className="mt-1.5 w-0.5 flex-1 bg-gray-100" />}
          </div>
          <VStack gap={2} className="min-w-0 flex-1 pb-1">
            <Text typography="subtitle1" render={<h3 />}>
              {step.title}
            </Text>
            <Text typography="body3" foreground="muted" render={<p />}>
              {step.body}
            </Text>
            {step.note && (
              <div className="border-l-2 border-tinted-border pl-3">
                <Text typography="body3" foreground="muted" render={<p />}>
                  {step.note}
                </Text>
              </div>
            )}
          </VStack>
        </div>
      ))}
    </VStack>
  );
}
