export interface _IMaybe<T> {
  isJust(): boolean;
  isNothing(): boolean;
  getOrElse(defaultValue: T): T;
};
