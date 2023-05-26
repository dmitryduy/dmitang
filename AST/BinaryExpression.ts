import Expression from "./expression";
import Block from "./block";

export default class BinaryExpression extends Expression {
  operator: string;
  expr1: Expression;
  expr2: Expression;
  constructor(operator: string, expr1: Expression, expr2: Expression) {
    super();
    this.operator = operator;
    this.expr1 = expr1;
    this.expr2 = expr2;
  }

  eval(context: Block) {
    switch (this.operator) {
      case '+':
        return this.expr1.eval(context) + this.expr2.eval(context);
      case '-':
        return this.expr1.eval(context) - this.expr2.eval(context);
      case '*':
        return this.expr1.eval(context) * this.expr2.eval(context);
      case '/':
        if (this.expr2.eval(context) === 0) {
          throw new Error('Делить на ноль нельзя');
        }
        return this.expr1.eval(context) / this.expr2.eval(context);
    }
  }
}