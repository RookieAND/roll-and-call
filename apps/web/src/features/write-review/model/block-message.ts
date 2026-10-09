import { REVIEW_BLOCK_DIALOG } from "./review-block";

export function blockMessage(block: keyof typeof REVIEW_BLOCK_DIALOG) {
  const { title, description } = REVIEW_BLOCK_DIALOG[block];
  return `${title}. ${description}`;
}
