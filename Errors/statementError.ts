import { ErrorNames } from "./errorNames";

export default class StatementError extends Error {
  constructor(word: string) {
    super(`Предложение не должно начинатся со слова: ${word}`);
    this.name = ErrorNames.STATEMENT_ERROR;
  }
}