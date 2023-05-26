import Statement from "./statement";
import Expression from "./expression";
import Block from "./block";

export default class ReturnStatement extends Statement {
  expression: Expression;

  constructor(expression: Expression) {
    super('return');
    this.expression= expression;
  }

  execute(context: Block) {
    if (context.type !== 'function') {
      throw new Error('Оператор ret можно вызывать только в функциях');
    }
    return this.expression.eval(context);
  }
}