import Expression from "./expression";
import Variables from "./variables";

export default class VariableExpression extends Expression {
  key: string;
  constructor(key: string) {
    super();
    this.key = key;
  }

  eval() {
    return Variables.getVariable(this.key)
  }
}