export const enum TokenType {
  WORD='WORD',
  KEYWORD='KEYWORD',
  NUMBER='NUMBER',
  SEMICOLON='SEMICOLON',
  PLUS='PLUS',
  MINUS='MINUS',
  MUL='MUL',
  DIV='DIV',
  EOF='EOF',
  ASSIGN='ASSIGN',
  LPAREN='LPAREN',
  RPAREN='RPAREN',
  STRING='STRING',
  COMMA='COMMA',
  LBRACE='LBRACE',
  RBRACE='RBRACE'
}

export default class Token {
  lexeme: string;
  type: TokenType;

  constructor(lexeme: string, type: TokenType) {
    this.lexeme = lexeme;
    this.type = type;
  }
}