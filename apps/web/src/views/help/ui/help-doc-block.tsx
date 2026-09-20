import { Text, VStack } from "@trpg/ui";

import { HELP_BLOCK, type HelpBlock } from "../model/help-docs";
import { HelpFigure } from "./help-figure";
import { HelpRow } from "./help-row";

export function HelpDocBlock({ block }: { block: HelpBlock }) {
  if (block.kind === HELP_BLOCK.figure) {
    return <HelpFigure figure={block.figure} />;
  }

  if (block.kind === HELP_BLOCK.note) {
    return (
      <div className="border-l-2 border-tinted-border pl-150">
        <Text typography="body3" foreground="muted" render={<p />}>
          {block.body}
        </Text>
      </div>
    );
  }

  if (block.kind === HELP_BLOCK.rows) {
    return (
      <section>
        <Text typography="subtitle2" foreground="muted" render={<h3 />} className="mb-100">
          {block.label}
        </Text>
        <div className="overflow-hidden rounded-600 border border-gray-200">
          {block.rows.map((row) => (
            <HelpRow key={row.term} row={row} />
          ))}
        </div>
      </section>
    );
  }

  if (block.kind === HELP_BLOCK.compare) {
    return (
      <div className="grid grid-cols-2 gap-125">
        {block.columns.map((column) => (
          <div key={column.title} className="rounded-600 border border-gray-200 p-175">
            <Text typography="subtitle1" render={<h3 />}>
              {column.title}
            </Text>
            <Text typography="body3" foreground="muted" render={<p />} className="mt-075">
              {column.summary}
            </Text>
            <VStack gap="150" className="mt-150">
              {column.rows.map((row) => (
                <div key={row.term}>
                  <Text typography="body4" foreground="hint" render={<span />} className="block">
                    {row.term}
                  </Text>
                  <Text typography="body3" render={<p />} className="mt-050">
                    {row.description}
                  </Text>
                </div>
              ))}
            </VStack>
          </div>
        ))}
      </div>
    );
  }

  return (
    <VStack gap="200">
      {block.steps.map((step, index) => (
        <div key={step.title} className="flex gap-150">
          <div className="flex flex-none flex-col items-center">
            <Text
              typography="subtitle2"
              render={<span />}
              className="flex size-[26px] items-center justify-center rounded-400 bg-primary-600 text-white tabular-nums"
            >
              {index + 1}
            </Text>
            {index < block.steps.length - 1 && <span className="mt-075 w-0.5 flex-1 bg-gray-100" />}
          </div>
          <VStack gap="100" className="min-w-0 flex-1 pb-050">
            <Text typography="subtitle1" render={<h3 />}>
              {step.title}
            </Text>
            <Text typography="body3" foreground="muted" render={<p />}>
              {step.body}
            </Text>
            {step.figure && <HelpFigure figure={step.figure} />}
            {step.note && (
              <div className="border-l-2 border-tinted-border pl-150">
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
