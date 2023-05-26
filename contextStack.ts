import Block from "./AST/block";

export default class ContextStack {
  context: (Block | null)[] = [];
  constructor() {
  }

  push(context: Block | null) {
    this.context.push(context);
  }

  get() {
    return this.context[this.context.length - 1];
  }
  pop() {
    return this.context.pop();
  }
}