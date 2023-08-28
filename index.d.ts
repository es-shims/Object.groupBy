/**
 * Returns an object that groups the items of the iterable object into arrays, using the return value of the callback function as the key.
 * @param entries An iterable object that contains key-value entries for properties and methods.
 * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in `entries`.
 */
declare function groupBy<T, K extends string | number>(
  entries: Iterable<T>,
  callbackfn: (value: T, index: number, thisArg: T[]) => K
): Record<K, T[]>;

declare function groupBy(
  entries: Iterable<any>,
  callbackfn: (value: any, index: number, thisArg: any[]) => string | number
): Record<string | number, any[]>;


declare const ObjectGroupBy: typeof groupBy & {
  getPolyfill(): typeof groupBy;
  implementation(): typeof groupBy;
  shim(): void;
};

export = ObjectGroupBy;
