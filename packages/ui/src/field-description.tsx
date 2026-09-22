interface FieldDescriptionProps {
  text: string;
}

export function FieldDescription({ text }: FieldDescriptionProps) {
  return (
    <p data-slot="field-description" className="text-xs text-gray-600">
      {text}
    </p>
  );
}
