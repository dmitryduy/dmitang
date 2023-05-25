import Token, { TokenType } from "./token";

export const keywords = ['value', 'print'];

export default class Lexer {
  tokens: Token[] = [];
  code: string;
  length: number;
  position: number = 0;
  operators = ['/', '*', '-', '+', '=', ')', '(', ';'];

  constructor(code: string) {
    this.code = code;
    this.length = code.length;
  }

  tokenize(): Token[] {
    while (this.peek(0) !== '\0') {
      const letter = this.peek(0);
      if (this.operators.includes(letter)) {
        this.tokenizeOperator();
      } else if (/[a-zA-Z]/.test(this.peek(0))) {
        this.tokenizeWord();
      } else if (/[0-9]/.test(this.peek(0))) {
        this.tokenizeNumber();
      } else if (this.peek(0) === '"') {
        this.tokenizeString();
      } else {
        this.next();
      }
    }

    this.addToken(TokenType.EOF);
    return this.tokens;
  }

  tokenizeString() {
    let buffer = '';
    this.next();
    while (this.peek(0) !== '"') {
      buffer += this.peek(0);
      this.next();
    }
    this.next();

    this.addToken(TokenType.STRING, buffer);
  }

  tokenizeNumber() {
    let buffer = '';
    let isPoint = false;
    while (/[0-9]/.test(this.peek(0)) || (this.peek(0) === '.' && !isPoint)) {
      isPoint = this.peek(0) === '.';
      buffer += this.peek(0);
      this.next();
    }

    this.addToken(TokenType.NUMBER, buffer);
  }

  tokenizeWord() {
    let buffer = '';
    while (/[a-zA-Z]/.test(this.peek(0))) {

      buffer += this.peek(0);
      this.next();
    }

    if (keywords.includes(buffer)) {
      this.addToken(TokenType.KEYWORD, buffer);
    } else {
      this.addToken(TokenType.WORD, buffer);
    }
  }

  tokenizeOperator() {
    switch (this.peek(0)) {
      case '/':
        this.addToken(TokenType.DIV, this.peek(0));
        break;
      case '*':
        this.addToken(TokenType.MUL, this.peek(0));
        break;
      case '+':
        this.addToken(TokenType.PLUS, this.peek(0));
        break;
      case '-':
        this.addToken(TokenType.MINUS, this.peek(0));
        break;
      case '=':
        this.addToken(TokenType.ASSIGN, this.peek(0));
        break;
      case '(':
        this.addToken(TokenType.LPAREN, this.peek(0));
        break;
      case ')':
        this.addToken(TokenType.RPAREN, this.peek(0));
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON, this.peek(0));
        break;
      default:
        throw new Error('Incorrect operator');
    }
    this.next();
  }

  next() {
    this.position++;
  }

  peek(pos: number): string {
    const position = this.position + pos;
    if (position >= this.length) {
      return '\0';
    }

    return this.code[position];
  }

  addToken(type: TokenType, lexeme: string = '') {
    this.tokens.push(new Token(lexeme, type));
  }
}