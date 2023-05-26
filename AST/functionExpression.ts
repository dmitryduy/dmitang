import Expression from "./expression";
import Block from "./block";

export default class FunctionExpression extends Expression {
  name: string;
  args: Expression[];

  constructor(name: string, args: Expression[]) {
    super();
    this.name = name;
    this.args = [...args];
  }

  eval(context: Block) {
    return context.getFunction(this.name)!(...this.args.map(arg => arg.eval(context)));
  }
}