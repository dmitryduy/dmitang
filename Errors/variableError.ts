import { ErrorNames } from "./errorNames";

export default class VariableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ErrorNames.VARIABLE_ERROR;
  }
}