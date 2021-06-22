import { IValueProvider, IAddable, IMultiplyable } from '../interfaces';

export class Calculator implements IValueProvider<number>, IAddable<number>, IMultiplyable<number> {
  constructor(private _value: number = 0) {}
  value(): number { return this._value };
  add(value: number): this {
    this._value = this._value + value;
    return this;
  }
  multiply(value: number): this {
    this._value = this._value * value;
    return this;
  }
}
