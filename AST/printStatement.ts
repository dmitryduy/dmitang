import Statement from "./statement";
import Expression from "./expression";

export default class PrintStatement extends Statement {
  expr: Expression;
  constructor(expr: Expression) {
    super();
    this.expr = expr;
  }

  execute() {
    console.log(this.expr.eval());
  }

}