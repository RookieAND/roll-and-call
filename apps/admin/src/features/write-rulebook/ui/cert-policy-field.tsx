import { RadioCard, RadioGroup } from "@roll-and-call/ui";

const CERT_POLICY = { required: "required", free: "free" } as const;

interface CertPolicyFieldProps {
  certRequired: boolean;
  disabled?: boolean;
  labelledBy?: string;
  onChange: (certRequired: boolean) => void;
}

export function CertPolicyField({
  certRequired,
  disabled,
  labelledBy,
  onChange,
}: CertPolicyFieldProps) {
  const value = certRequired ? CERT_POLICY.required : CERT_POLICY.free;
  return (
    <RadioGroup
      value={value}
      disabled={disabled}
      onValueChange={(next) => onChange(next === CERT_POLICY.required)}
      aria-label={labelledBy ? undefined : "인증"}
      aria-labelledby={labelledBy}
      className="flex flex-col gap-075"
    >
      <RadioCard.Root value={CERT_POLICY.required}>
        <RadioCard.Title>인증 필요</RadioCard.Title>
        <RadioCard.Description>인증된 GM만 이 룰북으로 구인을 열 수 있습니다</RadioCard.Description>
        <RadioCard.Indicator />
      </RadioCard.Root>
      <RadioCard.Root value={CERT_POLICY.free}>
        <RadioCard.Title>인증 불필요</RadioCard.Title>
        <RadioCard.Description>운영진이 지정한 무료 배포 룰에만 적용합니다</RadioCard.Description>
        <RadioCard.Indicator />
      </RadioCard.Root>
    </RadioGroup>
  );
}
