import { Container, Text, VStack } from "@roll-and-call/ui";
import { notFound } from "next/navigation";

import { AppBar } from "@/shared/ui";

import { HELP_DOCS } from "../model/help-docs";
import { HelpDocBlock } from "./help-doc-block";
import { HelpRelatedRow } from "./help-related-row";

interface HelpDocViewProps {
  slug: string;
}

export function HelpDocView({ slug }: HelpDocViewProps) {
  const doc = HELP_DOCS.find((candidate) => candidate.slug === slug);
  if (!doc) notFound();

  const related = doc.related.flatMap((relatedSlug) => {
    const target = HELP_DOCS.find((candidate) => candidate.slug === relatedSlug);
    return target ? [target] : [];
  });

  return (
    <>
      <AppBar back="/help" title={doc.title} />
      <Container size="sm">
        <VStack gap="250" className="py-250">
          <VStack gap="100">
            <Text typography="body4" weight="extrabold" foreground="primary" render={<p />}>
              {doc.category}
            </Text>
            <Text typography="heading1" render={<h1 />}>
              {doc.title}
            </Text>
            {doc.lead && (
              <Text typography="body2" foreground="muted" render={<p />} className="text-pretty">
                {doc.lead}
              </Text>
            )}
          </VStack>

          {doc.blocks.map((block, index) => (
            <HelpDocBlock key={index} block={block} />
          ))}

          <VStack gap="125" render={<section />} className="border-t border-gray-200 pt-225">
            <Text typography="body4" weight="extrabold" foreground="hint" render={<h2 />}>
              이어 읽기
            </Text>
            {related.map((target) => (
              <HelpRelatedRow key={target.slug} slug={target.slug} title={target.title} />
            ))}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
