export default class Variables {
  static variable = new Map();

  static setVariable(key: string, value: any) {
    this.variable.set(key, value);
  }

  static getVariable(key: string) {
    if (this.variable.has(key)) {
      return this.variable.get(key);
    }

    throw Error(`Переменная ${key} не определена`);
  }
}