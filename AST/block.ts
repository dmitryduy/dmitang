import Statement from "./statement";
import { contextType } from "./constants";

export default class Block {
  args = new Map<string, any>();
  functions = new Map<string, (...args: any) => any>();
  statementOrBlocks: (Statement | Block)[] = [];
  type: contextType;
  context: Block | null;

  constructor(type: contextType, statements: (Statement | Block)[], context: Block | null) {
    this.statementOrBlocks = statements;
    this.type = type;
    this.context = context;
  }

  setArg<T>(name: string, value: T) {
    this.args.set(name, value);
  }

  getArg(name: string): any {
    if (this.args.has(name)) {
      return this.args.get(name)!;
    }
    if (this.context !== null) {
      return this.context.getArg(name);
    }
    throw new Error(`Переменная ${name} не определена`);
  }

  addStatementOrBlock(statementOrBlock: Statement | Block) {
    this.statementOrBlocks.push(statementOrBlock);
  }

  hasFunction(name: string) {
    return this.functions.has(name);
  }

  addFunction(name: string, fn:  (...args: any) => any) {
    if (this.hasFunction(name)) {
      throw new Error(`Функция ${name} уже определена`);
    }

    this.functions.set(name, fn);
  }

  getFunction(name: string): (...args: any) => any {
    if (this.functions.has(name)) {
      return this.functions.get(name)!;
    }
    if (this.context !== null) {
      return this.context.getFunction(name);
    }

    throw new Error(`Функция ${name} не определена`);
  }

  execute() {
    for (let statementOfBlock of this.statementOrBlocks) {
      if (statementOfBlock.type === 'return') {
        return statementOfBlock.execute(this);
      }

      statementOfBlock.execute(this);
    }
  }

  destroy() {
    this.functions.clear();
  }
}