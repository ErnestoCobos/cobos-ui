export type ClassValue = string | false | null | undefined;

/** Join truthy class names with a space. */
export function cls(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
