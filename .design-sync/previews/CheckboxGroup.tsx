import { Checkbox, CheckboxGroup, Field, VStack } from "@roll-and-call/ui";

export const Default = () => (
  <CheckboxGroup.Root defaultValue={["coc", "dnd"]}>
    <VStack gap="075">
      <Checkbox.Field>
        <Checkbox.Root name="coc">
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Checkbox.Label>CoC 7판</Checkbox.Label>
      </Checkbox.Field>
      <Checkbox.Field>
        <Checkbox.Root name="dnd">
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Checkbox.Label>DnD 5판</Checkbox.Label>
      </Checkbox.Field>
      <Checkbox.Field>
        <Checkbox.Root name="fiasco">
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Checkbox.Label>피아스코</Checkbox.Label>
      </Checkbox.Field>
    </VStack>
  </CheckboxGroup.Root>
);

export const WithField = () => (
  <Field.Root label="선호 룰" description="여러 개를 골라도 됩니다.">
    <CheckboxGroup.Root defaultValue={["coc"]}>
      <VStack gap="075">
        <Checkbox.Field>
          <Checkbox.Root name="coc">
            <Checkbox.Indicator />
          </Checkbox.Root>
          <Checkbox.Label>CoC 7판</Checkbox.Label>
        </Checkbox.Field>
        <Checkbox.Field>
          <Checkbox.Root name="dnd">
            <Checkbox.Indicator />
          </Checkbox.Root>
          <Checkbox.Label>DnD 5판</Checkbox.Label>
        </Checkbox.Field>
      </VStack>
    </CheckboxGroup.Root>
  </Field.Root>
);

export const Disabled = () => (
  <CheckboxGroup.Root defaultValue={["coc"]} disabled>
    <VStack gap="075">
      <Checkbox.Field>
        <Checkbox.Root name="coc">
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Checkbox.Label>CoC 7판</Checkbox.Label>
      </Checkbox.Field>
      <Checkbox.Field>
        <Checkbox.Root name="dnd">
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Checkbox.Label>DnD 5판</Checkbox.Label>
      </Checkbox.Field>
    </VStack>
  </CheckboxGroup.Root>
);
