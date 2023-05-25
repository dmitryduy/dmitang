import Lexer from "./lexer";
import Parser from "./AST/parser";

const code = `
value a = 10;
value b = (a + 10) / a;
a = b;
print("a = " + a);
print("b = " + b);
print("a + b = " + a + b);
`;

// переменная не определена
const code1 = `
value b = variable;
`;

// попытка присвоить зарезервированное слово
const code2 = `
value print = 10;
`;

// деление на 0
const code3 = `
value a = 10 / 0;
`;

// без точки с запятой
const code4 = `
value a = 10.4
`;

const lexer = new Lexer(code4);
const parser = new Parser(lexer.tokenize());
parser.parse().forEach(statement => statement.execute());