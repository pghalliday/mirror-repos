export function assertArrayOf<T>(scope: string, value: unknown, assertType: (scope: string, entry: unknown) => asserts entry is T): asserts value is T[] {
    if (!Array.isArray(value)) {
        throw new Error(`Invalid ${scope}: not an array`)
    }
    for (const index in value) {
        assertType(`${scope}[${index}]`, value[index]);
    }
}

export function assertMapOf<T>(scope: string, value: unknown, assertType: (scope: string, entry: unknown) => asserts entry is T): asserts value is { [key: string]: T } {
    assertObject(scope, value);
    for (const key in value) {
        assertType(`${scope}.${key}`, value[key]);
    }
}

export function assertObject(scope: string, value: unknown): asserts value is { [key: string]: unknown } {
    if (typeof value !== 'object') throw new Error(`Invalid ${scope}: not an object`);
    if (value === null) throw new Error(`Invalid ${scope}: is null`);
}

export function assertProperty<X extends { [key: string]: unknown }, Y extends PropertyKey>(scope: string, object: X, prop: Y): asserts object is X & Record<Y, unknown> {
    if (!Object.prototype.hasOwnProperty.call(object, prop)) throw new Error(`Invalid ${scope}: property not found [${prop}]`);
}

export function assertNumber(scope: string, value: unknown): asserts value is number {
    if (typeof value !== 'number') throw new Error(`Invalid ${scope}: not a number`);
}

export function assertBoolean(scope: string, value: unknown): asserts value is boolean {
    if (typeof value !== 'boolean') throw new Error(`Invalid ${scope}: not a boolean`);
}

export function assertString(scope: string, value: unknown): asserts value is string {
    if (typeof value !== 'string') throw new Error(`Invalid ${scope}: not a string`);
}

export function isObject(value: unknown): value is { [key: string]: unknown } {
    if (typeof value !== 'object') return false;
    return value !== null;
}

export function hasProperty<X extends { [key: string]: unknown }, Y extends PropertyKey>(object: X, prop: Y): object is X & Record<Y, unknown> {
    return Object.prototype.hasOwnProperty.call(object, prop);
}

export function isString(value: unknown): value is string {
    return typeof value === 'string';
}
