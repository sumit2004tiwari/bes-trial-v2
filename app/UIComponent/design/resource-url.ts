/** CMS resources may be absolute URLs or paths relative to the public directory. */
export function resourceUrl(value: string) {
  if (!value || /^(?:https?:|mailto:|tel:|#|\/\/)/i.test(value)) return value;
  return `/${value.replace(/^\/+/, "")}`;
}
