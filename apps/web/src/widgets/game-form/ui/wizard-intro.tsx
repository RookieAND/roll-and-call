import { Text } from "@trpg/ui";

export function WizardIntro({ title, description }: { title: string; description?: string }) {
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
