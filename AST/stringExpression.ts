import Expression from "./expression";

export default class StringExpression extends Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  eval() {
    return this.value;
  }
}