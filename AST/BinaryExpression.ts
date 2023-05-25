import Expression from "./expression";

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

  eval() {
    switch (this.operator) {
      case '+':
        return this.expr1.eval() + this.expr2.eval();
      case '-':
        return this.expr1.eval() - this.expr2.eval();
      case '*':
        return this.expr1.eval() * this.expr2.eval();
      case '/':
        if (this.expr2.eval() === 0) {
          throw new Error('Делить на ноль нельзя');
        }
        return this.expr1.eval() / this.expr2.eval();
    }
  }
}