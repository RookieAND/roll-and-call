import { HStack, IconButton } from "@trpg/ui";

// @trpg/ui ships no icon set (the app uses lucide-react); inline SVG stands in here.
const Chevron = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const More = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

export const Variants = () => (
  <HStack gap={2} align="center">
    <IconButton variant="ghost" aria-label="뒤로">
      <Chevron />
    </IconButton>
    <IconButton variant="outline" aria-label="더보기">
      <More />
    </IconButton>
    <IconButton variant="solid" aria-label="더보기">
      <More />
    </IconButton>
  </HStack>
);

export const Sizes = () => (
  <HStack gap={2} align="center">
    <IconButton variant="outline" size="sm" aria-label="더보기">
      <More />
    </IconButton>
    <IconButton variant="outline" size="md" aria-label="더보기">
      <More />
    </IconButton>
    <IconButton variant="outline" size="lg" aria-label="더보기">
      <More />
    </IconButton>
  </HStack>
);
