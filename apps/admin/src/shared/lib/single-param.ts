import { isString } from "es-toolkit";

export const singleParam = (value: string | string[] | undefined) =>
  isString(value) && value ? value : undefined;
