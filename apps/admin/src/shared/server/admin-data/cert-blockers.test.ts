import { describe, expect, it } from "vitest";

import { certBlockers } from "./cert-blockers";
import type { CertApplication, Rulebook } from "./types";

const book = (id: string, kind: Rulebook["kind"], edition = "3rd") =>
  ({ id, name: id, edition, category: "더블크로스", kind }) as Rulebook;

const application = (id: string, overrides: Partial<CertApplication>) =>
  ({
    id,
    userId: "me",
    rulebookId: "1권",
    format: "physical",
    status: "pending",
    appliedAt: new Date(),
    purchase: {
      seller: null,
      captureUrl: null,
      receiptUrl: null,
      orderNumber: null,
      orderDate: null,
    },
    ...overrides,
  }) as CertApplication;

const rulebooks = [book("1권", "core"), book("2권", "core"), book("인피니티 코드", "supplement")];
const users = [{ id: "other", nickname: "모래시계" }] as never;

describe("certBlockers", () => {
  it("기본 룰북이 심사 대기면 서플리먼트는 그 결정을 기다린다", () => {
    const supplement = application("s", { rulebookId: "인피니티 코드" });
    const records = {
      rulebooks,
      users,
      certifications: [{ userId: "me", rulebookId: "1권" }] as never,
      certApplications: [application("c", { rulebookId: "2권" }), supplement],
    };
    expect(certBlockers(supplement, records).waitingOn).toEqual(["2권 3rd"]);
  });

  it("다른 사람이 같은 판매처·주문번호로 낸 전자책이 있으면 중복", () => {
    const purchase = {
      seller: "리디",
      orderNumber: "2026091500231",
      captureUrl: null,
      receiptUrl: null,
      orderDate: null,
    };
    const mine = application("m", { format: "ebook", purchase });
    const theirs = application("t", { userId: "other", status: "approved", purchase });
    const records = { rulebooks, users, certifications: [], certApplications: [mine, theirs] };
    expect(certBlockers(mine, records).duplicate?.nickname).toBe("모래시계");
    expect(
      certBlockers(mine, {
        ...records,
        certApplications: [mine, { ...theirs, status: "rejected" }],
      }).duplicate,
    ).toBeNull();
  });
});
