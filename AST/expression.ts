import Block from "./block";

export default abstract class Expression{

  eval(context: Block): any{}
}