import { Button, Container, FloatingBar, Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

import { CERT_STATE, CertStateRow, certRowMeta, toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { rulebookSections } from "../model/rulebook-sections";
import { RulebookListSection } from "./rulebook-list-section";

const ROW_LINK_CLASS = "block transition-colors hover:bg-gray-50";

export async function MyRulebooksView() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me" title="인증한 룰북" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const sections = rulebookSections(toMyRulebooks(await getRulebookRecords(user.id)));
  const inProgressCount = sections.rejected.length + sections.waiting.length;

  return (
    <>
      <AppBar back="/me" title="인증한 룰북" />
      <Container size="sm">
        <VStack gap="300" className="pt-225 pb-250">
          <RulebookListSection title="인증 완료된 룰" count={sections.usable.length}>
            {sections.usable.length === 0 && (
              <Text typography="body3" foreground="hint" render={<p />} className="px-175 py-200">
                아직 인증된 룰북이 없습니다.
              </Text>
            )}
            {sections.usable.map((rulebook) => (
              <Link
                key={rulebook.id}
                href={`/me/rulebooks/${rulebook.id}`}
                className={ROW_LINK_CLASS}
              >
                <CertStateRow
                  state={CERT_STATE.certified}
                  title={rulebook.label}
                  meta={certRowMeta(rulebook)}
                  statusPlacement="none"
                />
              </Link>
            ))}
          </RulebookListSection>

          {inProgressCount > 0 && (
            <RulebookListSection title="처리 중인 룰" count={inProgressCount}>
              {sections.rejected.map((rulebook) => (
                <Link
                  key={rulebook.id}
                  href={`/me/rulebooks/${rulebook.id}`}
                  className={ROW_LINK_CLASS}
                >
                  <CertStateRow
                    state={CERT_STATE.rejected}
                    title={rulebook.label}
                    meta={certRowMeta(rulebook)}
                    statusPlacement="badge"
                  />
                </Link>
              ))}
              {sections.waiting.map((item) =>
                item.kind === "pending" ? (
                  <Link
                    key={item.rulebook.id}
                    href={`/me/rulebooks/${item.rulebook.id}`}
                    className={ROW_LINK_CLASS}
                  >
                    <CertStateRow
                      state={CERT_STATE.pending}
                      title={item.rulebook.label}
                      meta={certRowMeta(item.rulebook)}
                      statusPlacement="badge"
                    />
                  </Link>
                ) : (
                  <CertStateRow
                    key={item.id}
                    state={CERT_STATE.requested}
                    title={item.label}
                    meta="운영진이 추가 요청을 확인하고 있습니다"
                    statusPlacement="badge"
                    chevron={false}
                  />
                ),
              )}
            </RulebookListSection>
          )}
        </VStack>
      </Container>
      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <Container size="sm">
            <Button render={<Link href="/me/rulebooks/apply" />} size="lg" className="w-full">
              <Plus size={16} strokeWidth={2.2} aria-hidden />
              룰북 인증하기
            </Button>
          </Container>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
