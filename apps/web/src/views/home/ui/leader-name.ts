import type { RecordPerson } from "@/entities/badge";

export function leaderName(people: [RecordPerson, ...RecordPerson[]]) {
  const [first, ...rest] = people;
  if (rest.length === 0) return first.username;
  if (rest.length === 1) return people.map((person) => person.username).join(" · ");
  return `${first.username} 외 ${rest.length}인`;
}
