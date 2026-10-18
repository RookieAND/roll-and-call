import { CERT_OPTION, type CertOptionType } from "@/entities/rulebook";

export function bookTitleForeground(type: CertOptionType) {
  if (type === CERT_OPTION.pick) return "normal";
  if (type === CERT_OPTION.needsCore || type === CERT_OPTION.free) return "hint";
  return "muted";
}
