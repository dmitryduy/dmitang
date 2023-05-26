import Statement from "./statement";
import FunctionExpression from "./functionExpression";
import Block from "./block";

export default class FunctionStatement extends Statement {
  expression: FunctionExpression;

  constructor(expression: FunctionExpression) {
    super('function call');
    this.expression = expression;
  }

  execute(context: Block) {
    this.expression.eval(context);
  }
}