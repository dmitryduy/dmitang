import Expression from "./expression";

export default class NumberExpression extends Expression {
  value: number;

  constructor(value: number) {
    super();
    this.value = +value;
  }

  eval() {
    return this.value;
  }

}