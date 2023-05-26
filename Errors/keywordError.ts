import { ErrorNames } from "./errorNames";

export default class KeywordError extends Error {
  constructor(word: string) {
    super(`Слово ${word} не является ключевым словом языка`);
    this.name = ErrorNames.KEYWORD_ERROR;
  }
}