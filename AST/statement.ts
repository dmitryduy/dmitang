import { statementType } from "./constants";
import Block from "./block";

export default abstract class Statement {
  type: statementType;

  protected constructor(type: statementType) {
    this.type = type;
  }

  execute(context: Block){}
}