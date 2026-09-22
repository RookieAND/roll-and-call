import { Pagination } from "@roll-and-call/ui";

export const MiddlePage = () => (
  <Pagination page={5} totalPages={10} hrefFor={(page) => `/games?page=${page}`} />
);

export const FirstPage = () => (
  <Pagination page={1} totalPages={6} hrefFor={(page) => `/games?page=${page}`} />
);

export const LastPage = () => (
  <Pagination page={6} totalPages={6} hrefFor={(page) => `/games?page=${page}`} />
);

export const NarrowSiblings = () => (
  <Pagination page={3} totalPages={20} siblings={1} hrefFor={(page) => `/games?page=${page}`} />
);
