export async function fetchHasSessionTodo(): Promise<boolean> {
  const response = await fetch("/api/me/session-todo");
  if (!response.ok) return false;
  const { hasTodo } = (await response.json()) as { hasTodo: boolean };
  return hasTodo;
}
