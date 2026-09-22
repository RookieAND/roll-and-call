import { Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import { HELP_BLOCK, type HelpBlock } from "../model/help-docs";
import { HelpFigure } from "./help-figure";
import { HelpRow } from "./help-row";

interface HelpDocBlockProps {
  block: HelpBlock;
}

export function HelpDocBlock({ block }: HelpDocBlockProps) {
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
        <Text
          typography="body4"
          weight="extrabold"
          foreground="muted"
          render={<h3 />}
          className="mb-125"
        >
          {block.label}
        </Text>
        <Card.Root radius={600} background="none" padding="none" className="overflow-hidden">
          {block.rows.map((row) => (
            <HelpRow key={row.term} row={row} />
          ))}
        </Card.Root>
      </section>
    );
  }

  if (block.kind === HELP_BLOCK.compare) {
    return (
      <Grid cols={2} gap="125">
        {block.columns.map((column) => (
          <Card.Root
            key={column.title}
            radius={600}
            background="none"
            padding="none"
            className="p-175"
          >
            <Text typography="subtitle1" weight="extrabold" render={<h3 />}>
              {column.title}
            </Text>
            <Text typography="body3" foreground="muted" render={<p />} className="mt-075">
              {column.summary}
            </Text>
            <VStack gap="150" className="mt-150">
              {column.rows.map((row) => (
                <div key={row.term}>
                  <Text
                    typography="body4"
                    weight="extrabold"
                    foreground="muted"
                    render={<span />}
                    className="block"
                  >
                    {row.term}
                  </Text>
                  <Text typography="body3" render={<p />} className="mt-050">
                    {row.description}
                  </Text>
                </div>
              ))}
            </VStack>
          </Card.Root>
        ))}
      </Grid>
    );
  }

  return (
    <VStack gap="200">
      {block.steps.map((step, index) => (
        <HStack key={step.title} gap="150">
          <VStack align="center" className="flex-none">
            <Text
              typography="body4"
              weight="extrabold"
              render={<span />}
              className="flex size-[26px] items-center justify-center rounded-400 bg-primary-600 text-white tabular-nums"
            >
              {index + 1}
            </Text>
            {index < block.steps.length - 1 && <span className="mt-075 w-0.5 flex-1 bg-gray-100" />}
          </VStack>
          <VStack gap="100" className="min-w-0 flex-1 pb-050">
            <Text typography="subtitle1" weight="extrabold" render={<h3 />}>
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
        </HStack>
      ))}
    </VStack>
  );
}
