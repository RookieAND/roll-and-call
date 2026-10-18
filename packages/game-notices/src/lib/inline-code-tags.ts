// 값마다 인라인 코드로 감싸 태그처럼 보이게 한다. 값 안의 백틱은 코드를 닫지 않게 작은따옴표로 바꾼다.
export const inlineCodeTags = (values: string[]) =>
  values.map((value) => `\`${value.replaceAll("`", "'")}\``).join(" ");
