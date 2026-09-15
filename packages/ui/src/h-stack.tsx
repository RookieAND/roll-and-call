import { Flex, type StackProps } from "./flex";

export function HStack(props: StackProps) {
  return <Flex direction="row" {...props} />;
}
