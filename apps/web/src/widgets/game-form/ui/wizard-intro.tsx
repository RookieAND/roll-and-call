import { Text } from "@roll-and-call/ui";

interface WizardIntroProps {
  title: string;
  description?: string;
}

export function WizardIntro({ title, description }: WizardIntroProps) {
  return (
    <div>
      <Text typography="heading2" render={<h1 />} className="block">
        {title}
      </Text>
      <Text typography="body3" foreground="muted" render={<p />} className="mt-050">
        {description}
      </Text>
    </div>
  );
}
