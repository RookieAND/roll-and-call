import type { TrialKind } from "./trial-kind";

export interface TrialReview {
  body: string;
  spoiler: boolean;
  photoUrls: string[];
}

export interface TrialRecruit {
  title: string;
  recruitMethod: "first_come" | "lottery";
  maxPlayers: number;
}

export const TRIAL_CERT_STATUS = { pending: "pending", approved: "approved" } as const;
export type TrialCertStatus = (typeof TRIAL_CERT_STATUS)[keyof typeof TRIAL_CERT_STATUS];

export interface TrialCert {
  format: "physical" | "ebook";
  status: TrialCertStatus;
}

// 체험에서 만든 것. 브라우저 메모리에만 있고 새로고침하면 사라진다.
export interface TrialStore {
  applied: Partial<Record<TrialKind, true>>;
  review: TrialReview | null;
  cert: TrialCert | null;
  recruit: TrialRecruit | null;
}

export const EMPTY_TRIAL_STORE: TrialStore = {
  applied: {},
  review: null,
  cert: null,
  recruit: null,
};

export type TrialAction =
  | { type: "apply"; kind: TrialKind }
  | { type: "cancelApply"; kind: TrialKind }
  | { type: "writeReview"; review: TrialReview }
  | { type: "submitCert"; format: TrialCert["format"] }
  | { type: "approveCert" }
  | { type: "createRecruit"; recruit: TrialRecruit };

export function trialReducer(store: TrialStore, action: TrialAction): TrialStore {
  switch (action.type) {
    case "apply":
      return { ...store, applied: { ...store.applied, [action.kind]: true } };
    case "cancelApply": {
      const { [action.kind]: _removed, ...rest } = store.applied;
      return { ...store, applied: rest };
    }
    case "writeReview":
      return { ...store, review: action.review };
    case "createRecruit":
      return { ...store, recruit: action.recruit };
    case "submitCert":
      return { ...store, cert: { format: action.format, status: TRIAL_CERT_STATUS.pending } };
    case "approveCert":
      return store.cert
        ? { ...store, cert: { ...store.cert, status: TRIAL_CERT_STATUS.approved } }
        : store;
  }
}
