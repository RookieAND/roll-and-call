export async function fetchHasSessionTodo(slug: string): Promise<boolean> {
  const response = await fetch(`/api/me/session-todo?server=${slug}`);
  if (!response.ok) return false;
  const { hasTodo } = (await response.json()) as { hasTodo: boolean };
  return hasTodo;
}
