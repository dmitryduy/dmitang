import Statement from "./statement";
import Expression from "./expression";
import Block from "./block";

export default class AssignStatement extends Statement {
  expression: Expression;
  variable: string;

  constructor(variable: string, expression: Expression) {
    super('assign');
    this.expression = expression;
    this.variable = variable;
  }

  execute(context: Block) {
    context.setArg(this.variable, this.expression.eval(context));
  }
}