import Lexer from "./lexer";
import Parser from "./AST/parser";

const codes = [`
value a = 10;
value b = (a + 10) / a;
a = b;
print("a = " + a);
print("b = " + b);
print("a + b = " + a + b);
`,

// переменная не определена
  `
value b = variable;
`,

// попытка присвоить зарезервированное слово
  `
value print = 10;
`,

// деление на 0
  `
value a = 10 / 0;
`,

// без точки с запятой
  `
value a = 10.4
`,
  `
func printValue(val) {
  print("value = " + val);
}
func sum(val1, val2) {
  ret val1 + val2;
}
func mul(val1, val2) {
  func test() {
  print("test");
  }
  ret val1 * val2;
}
value b = 10;
printValue(sum(4, b) * mul(5, 1));
test();
`];


const code = `func printValue(val) {
  print("value = " + val);
}
func sum(val1, val2) {
  ret val1 + val2;
}
func mul(val1, val2) {
  func test() {
  print("test");
  }
  ret val1 * val2;
}
value b = 10;
printValue(sum(4, b) * mul(5, 1));
test();`

const code1 =`
func mul(val1, val2) {
  func test() {
  value val1 = 10;
  print(val1);
  }
  test();
  ret val1 * val2;
}

print(mul(1,2));
print(mul(1, 22));
`

const lexer = new Lexer(code1);
const parser = new Parser(lexer.tokenize());
parser.parse().execute();
