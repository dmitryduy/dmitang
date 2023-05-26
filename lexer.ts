import Token, { TokenType } from "./token";
import {
  DIGIT_REGEX,
  KEYWORDS,
  OPERATORS,
  REAL_NUMBER_DELIMITER,
  START_WORD_LETTER_REGEX,
  STRING_FRAMING, WORD_LETTER_REGEX
} from "./constants";

export default class Lexer {
  tokens: Token[] = [];
  code: string;
  length: number;
  position: number = 0;

  constructor(code: string) {
    this.code = code;
    this.length = code.length;
  }

  tokenize(): Token[] {
    while (this.peek(0) !== '\0') {
      if (OPERATORS.includes(this.peek(0))) {
        this.tokenizeOperator();
      } else if (START_WORD_LETTER_REGEX.test(this.peek(0))) {
        this.tokenizeWord();
      } else if (DIGIT_REGEX.test(this.peek(0))) {
        this.tokenizeNumber();
      } else if (this.peek(0) === STRING_FRAMING) {
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
    while (this.peek(0) !== STRING_FRAMING) {
      buffer += this.peek(0);
      this.next();
    }
    this.next();

    this.addToken(TokenType.STRING, buffer);
  }

  tokenizeNumber() {
    let buffer = '';
    let isPoint = false;
    while (DIGIT_REGEX.test(this.peek(0)) || (this.peek(0) === REAL_NUMBER_DELIMITER && !isPoint)) {
      isPoint = this.peek(0) === REAL_NUMBER_DELIMITER;
      buffer += this.peek(0);
      this.next();
    }

    this.addToken(TokenType.NUMBER, buffer);
  }

  tokenizeWord() {
    let buffer = '';
    while (WORD_LETTER_REGEX.test(this.peek(0))) {
      buffer += this.peek(0);
      this.next();
    }

    if (KEYWORDS.includes(buffer)) {
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
      case ',':
        this.addToken(TokenType.COMMA, this.peek(0));
        break;
      case '{':
        this.addToken(TokenType.LBRACE, this.peek(0));
        break;
      case '}':
        this.addToken(TokenType.RBRACE, this.peek(0));
        break;
      default:
        throw new Error(`Неверный оператор "${this.peek(0)}"`);
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