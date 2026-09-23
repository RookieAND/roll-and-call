import { Flex, type StackProps } from "./flex";

export function VStack(props: StackProps) {
  return <Flex direction="column" {...props} />;
}
