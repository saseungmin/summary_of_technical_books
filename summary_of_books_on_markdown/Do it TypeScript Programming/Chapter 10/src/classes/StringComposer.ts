import { IValueProvider, IAddable, IMultiplyable } from '../interfaces';

export class StringComposer implements IValueProvider<string>, IAddable<string>, IMultiplyable<number> {
  constructor(private _value: string = '') {}
  value(): string { return this._value };
  add(value: string): this {
    this._value = this._value.concat(value);
    return this;
  }
  multiply(repeat: number): this {
    const value = this.value();
    for (let index = 0; index < repeat; index++) {
      this.add(value);
    }
    return this;
  }
}
