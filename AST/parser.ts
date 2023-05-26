import Token, { TokenType } from "../token";
import Statement from "./statement";
import AssignStatement from "./assignStatement";
import Expression from "./expression";
import NumberExpression from "./NumberExpression";
import BinaryExpression from "./BinaryExpression";
import VariableExpression from "./variableExpression";
import StringExpression from "./stringExpression";
import FunctionExpression from "./functionExpression";
import FunctionStatement from "./functionStatement";
import UserFunctionDeclaration from "./userFunctionDeclaration";
import ReturnStatement from "./returnStatement";
import { KEYWORDS } from "../constants";
import KeywordError from "../Errors/keywordError";
import StatementError from "../Errors/statementError";
import VariableError from "../Errors/variableError";
import Block from "./block";
import ContextStack from "../contextStack";

export default class Parser {
  tokens: Token[];
  position: number = 0;
  length: number;
  mainBlock: Block = new Block('global', [], null);
  contextStack = new ContextStack();

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.length = tokens.length;
  }

  parse() {
    this.mainBlock.addFunction('print', (...args: any) => {
      console.log(...args);
      return '';
    });

    this.contextStack.push(this.mainBlock);
    while (this.peek(0).type !== TokenType.EOF) {
      this.mainBlock.addStatementOrBlock(this.statementOrBlock());
    }
    this.contextStack.pop();

    return this.mainBlock;
  }

  statementOrBlock(): Statement | Block {
    if (this.match(TokenType.KEYWORD)) {
      return this.handleKeyword(this.peek(-1).lexeme);
    }
    if (this.peek(0).type === TokenType.WORD && this.peek(1).type === TokenType.LPAREN) {
      const statement = this.functionStatement();
      this.checkSemicolon();
      return statement;
    }
    if (this.peek(0).type === TokenType.WORD) {
      const statement = this.assignStatement();
      this.consume(this.match(TokenType.SEMICOLON));
      return statement;
    }
    throw new StatementError(this.peek(0).lexeme);
  }

  handleKeyword(keyword: string): Statement | Block {
    if (!KEYWORDS.includes(keyword)) {
      throw new KeywordError(keyword);
    }
    let statement: Statement | null = null;

    switch (keyword) {
      case 'value':
        statement = this.assignStatement();
        this.checkSemicolon();
        return statement;
      case 'func':
        return this.functionBlock();
      case 'ret':
        statement = this.returnStatement();
        this.checkSemicolon();
        return statement;
      default:
        throw new Error('Непредвиденная ошибка');
    }
  }

  checkSemicolon() {
    this.consume(this.match(TokenType.SEMICOLON));
  }

  returnStatement(): ReturnStatement {
    return new ReturnStatement(this.expression());
  }

  functionStatement(): FunctionStatement {
    return new FunctionStatement(this.functionExpression());
  }

  functionBlock(): UserFunctionDeclaration {
    const token = this.peek(0);
    if (this.match(TokenType.WORD)) {
      if (KEYWORDS.includes(token.lexeme)) {
        throw new VariableError(`${token.lexeme} зарезервированное слово`);
      }
      this.consume(this.match(TokenType.LPAREN));
      const functionDeclarationBlock = new UserFunctionDeclaration(token.lexeme, this.contextStack.get() as Block);
      this.contextStack.push(functionDeclarationBlock);
      const expressions: VariableExpression[] = [];
      if (this.match(TokenType.RPAREN)) {
        const block = this.block();
        block.forEach(functionDeclarationBlock.addStatementOrBlock.bind(functionDeclarationBlock));
        return functionDeclarationBlock;
      }
      while (true) {
        const expression = this.expression();
        if (!(expression instanceof VariableExpression)) {
          throw new Error(`${expression} должно быть VariableExpression`);
        }
        expressions.push(expression);
        if (this.match(TokenType.RPAREN)) {
          break;
        }
        this.consume(this.match(TokenType.COMMA));
      }
      const block = this.block();
      block.forEach(functionDeclarationBlock.addStatementOrBlock.bind(functionDeclarationBlock));
      expressions.forEach(functionDeclarationBlock.addExpression.bind(functionDeclarationBlock));

      this.contextStack.pop();
      return functionDeclarationBlock;
    }

    throw new Error('Нет имени функции');
  }

  block(): (Statement | Block)[] {
    const body: (Statement | Block)[] = [];
    this.consume(this.match(TokenType.LBRACE));
    while (!this.match(TokenType.RBRACE)) {
      body.push(this.statementOrBlock());
    }

    return body;
  }

  assignStatement(): AssignStatement {
    const token = this.peek(0);

    if (this.match(TokenType.WORD)) {
      if (KEYWORDS.includes(token.lexeme)) {
        throw new VariableError(`${token.lexeme} зарезервированное слово`);
      }
      this.consume(this.match(TokenType.ASSIGN));
      return new AssignStatement(token.lexeme, this.expression());
    }
    throw Error('Синтаксическая ошибка в определении переменной');
  }

  expression(): Expression {
    return this.additive();
  }

  functionExpression(): FunctionExpression {
    const token = this.peek(0);
    if (this.match(TokenType.WORD)) {
      this.consume(this.match(TokenType.LPAREN));
      const expressions: Expression[] = [];
      if (this.match(TokenType.RPAREN)) {
        return new FunctionExpression(token.lexeme, []);
      }
      while (true) {
        expressions.push(this.expression());
        if (this.match(TokenType.RPAREN)) {
          return new FunctionExpression(token.lexeme, expressions);
        }
        this.consume(this.match(TokenType.COMMA));
      }
    }

    throw new Error('Неизвестная ошибка в функции');
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

  multiplicative(): Expression {
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
    if (token.type === TokenType.WORD && this.peek(1).type === TokenType.LPAREN) {
      return this.functionExpression();
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

  match(...expectedTokens: TokenType[]): boolean {
    for (let token of expectedTokens) {
      if (this.peek(0).type === token) {
        this.position++;
        return true;
      }
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