import { Card, Container, Text, VStack } from "@trpg/ui";
import { notFound } from "next/navigation";

import { AppBar } from "@/shared/ui";

import { HELP_DOCS } from "../model/help-docs";
import { HelpDocBlock } from "./help-doc-block";
import { HelpDocRow } from "./help-doc-row";

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
        <VStack gap="250" className="py-225">
          <div>
            <Text typography="subtitle2" foreground="primary" render={<p />}>
              {doc.category}
            </Text>
            <Text typography="heading1" render={<h1 />} className="mt-075">
              {doc.title}
            </Text>
            <Text typography="body2" foreground="muted" render={<p />} className="mt-125">
              {doc.lead}
            </Text>
          </div>

          {doc.blocks.map((block, index) => (
            <HelpDocBlock key={index} block={block} />
          ))}

          <section className="border-t border-gray-100 pt-200">
            <Text typography="subtitle2" foreground="muted" render={<h2 />} className="mb-100">
              이어 읽기
            </Text>
            <Card radius={600} background="none" padding="none" className="overflow-hidden">
              {related.map((target) => (
                <HelpDocRow key={target.slug} slug={target.slug} title={target.title} />
              ))}
            </Card>
          </section>
        </VStack>
      </Container>
    </>
  );
}
