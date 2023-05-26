import Expression from "./expression";
import Block from "./block";

export default class VariableExpression extends Expression {
  key: string;
  constructor(key: string) {
    super();
    this.key = key;
  }

  eval(context: Block) {
    return context.getArg(this.key);
  }
}