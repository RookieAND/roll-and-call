import { IconButton, HStack } from "@roll-and-call/ui";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

export const VariantSweep = () => (
  <HStack gap="100" className="items-center">
    <IconButton variant="solid" aria-label="다음 주">
      <ChevronRight size={20} aria-hidden />
    </IconButton>
    <IconButton variant="outline" aria-label="이전 주">
      <ChevronLeft size={20} aria-hidden />
    </IconButton>
    <IconButton variant="ghost" aria-label="더보기">
      <MoreVertical size={20} aria-hidden />
    </IconButton>
  </HStack>
);

export const Sizes = () => (
  <HStack gap="100" className="items-center">
    <IconButton size="sm" aria-label="이전 주">
      <ChevronLeft size={16} aria-hidden />
    </IconButton>
    <IconButton size="md" aria-label="이전 주">
      <ChevronLeft size={20} aria-hidden />
    </IconButton>
    <IconButton size="lg" aria-label="이전 주">
      <ChevronLeft size={24} aria-hidden />
    </IconButton>
  </HStack>
);

export const Disabled = () => (
  <HStack gap="100" className="items-center">
    <IconButton aria-label="이전 주" disabled>
      <ChevronLeft size={20} aria-hidden />
    </IconButton>
    <IconButton variant="outline" aria-label="다음 주" disabled>
      <ChevronRight size={20} aria-hidden />
    </IconButton>
  </HStack>
);
