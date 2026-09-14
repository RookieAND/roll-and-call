import { Card, Grid, Text } from "@trpg/ui";

const stats = [
  ["참여한 세션", "12"],
  ["연 세션", "4"],
  ["대기 중", "1"],
];

export const Stats = () => (
  <Grid cols={3} gap={2}>
    {stats.map(([label, value]) => (
      <Card key={label} padding="sm">
        <Text typography="body4" foreground="muted" render={<div />}>
          {label}
        </Text>
        <Text typography="heading2" render={<div />}>
          {value}
        </Text>
      </Card>
    ))}
  </Grid>
);
