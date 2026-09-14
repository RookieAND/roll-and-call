import { Pagination } from "@trpg/ui";

const hrefFor = (p: number) => `#page=${p}`;

export const Middle = () => <Pagination page={4} totalPages={9} hrefFor={hrefFor} />;

export const FirstPage = () => <Pagination page={1} totalPages={3} hrefFor={hrefFor} />;
