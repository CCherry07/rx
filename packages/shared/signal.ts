import { Signal, Computed } from "alien-signals";
import { isFunction } from "./utils";

export type MaybeSignalOrComputed<T = any> =
  | T
  | Computed<T>
  | Signal<T>

export type MaybeSignal<T = any> =
  | T
  | Signal<T>

export type MaybeSignalOrGetter<T = any> = MaybeSignal<T> | (() => T)

export type MaybeSignalOrComputedOrGetter<T = any> = MaybeSignalOrComputed<T> | (() => T)

export function isSignal<T>(v: MaybeSignal<T>): v is Signal<T> {
  return v instanceof Signal;
}

export function isComputed<T>(v: MaybeSignalOrComputed<T>): v is Computed<T> {
  return v instanceof Computed;
}

export function isSignalOrComputed<T>(v: MaybeSignalOrComputed<T>): v is Signal<T> | Computed<T> {
  return isSignal(v) || isComputed(v);
}

export function unSignal<T>(signal: MaybeSignal<T>): T {
  return isSignal(signal) ? signal.get() : signal
}

export function unSignalOrComputed<T>(signal: MaybeSignalOrComputed<T>): T {
  return isSignalOrComputed(signal) ? signal.get() : unSignal(signal)
}

export function toValue<T>(source: MaybeSignalOrComputedOrGetter<T>): T {
  return isFunction(source) ? source() : unSignalOrComputed(source);
}

export function toDeepValue<T>(source: MaybeSignalOrGetter<T>): T {
  if (isFunction(source)) {
    return toDeepValue(source());
  } else if (isSignal(source)) {
    return toDeepValue(source.get());
  } else if (Array.isArray(source)) {
    return source.map(toDeepValue) as T;
  } else if (typeof source === 'object' && source !== null) {
    return Object.keys(source).reduce((acc, key) => {
      // @ts-ignore
      acc[key] = toDeepValue(source[key]);
      return acc;
    }, {} as Record<string, any>) as T;
  } else {
    return source;
  }
}

function parseSignalPath(signalPath: string): Array<string | number> {
  const pathArray: Array<string | number> = [];
  const regex = /[^.[\]]+|\[(\d+)]/g;
  let match;
  while ((match = regex.exec(signalPath)) !== null) {
    if (match[1] !== undefined) {
      pathArray.push(Number(match[1]));
    } else {
      pathArray.push(match[0]);
    }
  }
  return pathArray;
}
/**
 *
 * @param path the signal path that needs to be accessed
 * @param signal signal
 * @returns signal at the end of the path
 * @example
 * normalizeSignal('userinfo.name', model) -> model.value.userinfo.value.name
 */
export function normalizeSignal<T, D>(path: string, signal: Signal<T>): Signal<D> {
  const pathArray = parseSignalPath(path);
  let current = signal as any;
  for (let i = 0; i < pathArray.length; i++) {
    const key = pathArray[i];
    try {
      current = current.value[key];
    } catch (error) {
      throw new Error(`Cannot find signal at path 【${path}】，the error is ${error}`);
    }
  }
  return current as Signal<D>;
}

export type SignalValue<T> = T extends Signal<infer S> ? S : T;

export function toRaw<T>(source: MaybeSignalOrGetter<T>): T {
  if (isFunction(source)) {
    return toRaw(source());
  } else if (isSignal(source)) {
    return toRaw(source.currentValue);
  } else if (Array.isArray(source)) {
    return source.map(toRaw) as T;
  } else if (typeof source === 'object' && source !== null) {
    return Object.keys(source).reduce((acc, key) => {
      // @ts-ignore
      acc[key] = toRaw(source[key]);
      return acc;
    }, {} as Record<string, any>) as T;
  } else {
    return source;
  }
}
