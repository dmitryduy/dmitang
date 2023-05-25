import Token, { TokenType } from "../token";
import Statement from "./statement";
import AssignStatement from "./assignStatement";
import { keywords } from "../lexer";
import Expression from "./expression";
import NumberExpression from "./NumberExpression";
import BinaryExpression from "./BinaryExpression";
import VariableExpression from "./variableExpression";
import PrintStatement from "./printStatement";
import StringExpression from "./stringExpression";

export default class Parser {
  tokens: Token[];
  position: number = 0;
  length: number;
  statements: Statement[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.length = tokens.length;
  }

  parse() {
    while (this.peek(0).type !== TokenType.EOF) {
      this.statements.push(this.statement());
    }

    return this.statements;
  }

  statement(): Statement {
    if (this.match(TokenType.KEYWORD)) {
      const lexeme = this.peek(-1).lexeme;
      if (lexeme === 'value') {
         const statement = this.assignStatement();
         this.consume(this.match(TokenType.SEMICOLON));
         return statement;
      }
      if (lexeme === 'print') {
        this.consume(this.match(TokenType.LPAREN));
        const statement = this.printStatement();
        this.consume(this.match(TokenType.RPAREN));
        this.consume(this.match(TokenType.SEMICOLON));
        return statement;
      }
    }

    const statement = this.assignStatement();
    this.consume(this.match(TokenType.SEMICOLON));
    return statement;
  }

  printStatement():PrintStatement {
    return new PrintStatement(this.expression());
  }
  assignStatement(): AssignStatement {
    const token = this.peek(0);

    if (this.match(TokenType.WORD)) {
      if (keywords.includes(token.lexeme)) {
        throw Error (`${token.lexeme} зарезервированное слово`);
      }
      this.consume(this.match(TokenType.ASSIGN));
      return new AssignStatement(token.lexeme, this.expression());
    }
    throw Error ('Синтаксическая ошибка в определении переменной');
  }

  expression(): Expression {
    return this.additive();
  }
  additive(): Expression {
    const expression = this.multiplicative();

    if (this.match(TokenType.PLUS)) {
      return new BinaryExpression('+', expression, this.expression());
    }
    if (this.match(TokenType.MINUS)) {
      return new BinaryExpression('-', expression, this.expression());
    }

    return expression;
  }
  multiplicative(): Expression{
    const expression = this.primary();
    if (this.match(TokenType.MUL)) {
      return new BinaryExpression('*', expression, this.expression());
    }
    if (this.match(TokenType.DIV)) {
      return new BinaryExpression('/', expression, this.expression());
    }

    return expression;
  }

  primary(): Expression {
    const token = this.peek(0);
    if (this.match(TokenType.LPAREN)) {
      const expression = this.expression();
      this.consume(this.match(TokenType.RPAREN));
      return expression;
    }
    if (this.match(TokenType.NUMBER)) {
      return new NumberExpression(+token.lexeme);
    }
    if (this.match(TokenType.STRING)) {
      return new StringExpression(token.lexeme);
    }
    if (this.match(TokenType.WORD)) {
      return new VariableExpression(token.lexeme);
    }

    throw new Error('Синтаксическая ошибка');
  }

  consume(bool: boolean) {
    if (!bool) {
      throw Error('Ошибка синтаксиса');
    }
  }

  match(expectedToken: TokenType): boolean {
    if (this.peek(0).type === expectedToken){
      this.position++;
      return true;
    }

    return false;
  }

  peek(pos: number): Token {
    const position = this.position + pos;
    if (position >= this.length) {
      return new Token('', TokenType.EOF);
    }

    return this.tokens[position];
  }
}