import { LINK_SERVICES, type LinkServiceKey } from "./link-services";

export function isLinkServiceKey(value: unknown): value is LinkServiceKey {
  return LINK_SERVICES.some((service) => service.key === value);
}
