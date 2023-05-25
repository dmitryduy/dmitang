import Statement from "./statement";
import Expression from "./expression";
import Variables from "./variables";

export default class AssignStatement extends Statement {
  expression: Expression;
  variable: string;

  constructor(variable: string, expression: Expression) {
    super();
    this.expression = expression;
    this.variable = variable;
  }

  execute() {
    Variables.setVariable(this.variable, this.expression.eval());
  }
}