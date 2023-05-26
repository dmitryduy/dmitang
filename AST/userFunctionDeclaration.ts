import VariableExpression from "./variableExpression";
import Block from "./block";

export default class UserFunctionDeclaration extends Block {
  name: string;
  argExpressions: VariableExpression[] = [];
  self: UserFunctionDeclaration;

  constructor(name: string, context: Block) {
    super('function', [], context);
    this.name = name;
    this.self = this;
  }

  addExpression(expression: VariableExpression) {
    if (this.args.has(expression.key)) {
      throw new Error(`Аргумент ${expression.key} уже объявлен`);
    }
    this.argExpressions.push(expression);
    this.setArg(expression.key, 0);
  }

  execute() {
    if (!this.context) {
      throw new Error('Ошибка контекста');
    }
    this.context.addFunction(this.name, (...args: any) => {
      if (args.length !== this.argExpressions.length) {
        throw new Error(`У функции ${this.name} должно быть ${this.args.size} аргументов. Переданное количество аргументов: ${args.length}`);
      }
      for (let i = 0; i < this.argExpressions.length; i++) {
        this.setArg(this.argExpressions[i].key, args[i]);// TODO запрещать устанавливать внутренние переменные
      }

      const result = super.execute();

      this.destroy();

      return result;
    });
  }

  destroy() {
    this.functions.clear();
  }
}