import {hasProperty, isObject, isString} from "./util";

export interface LogMessageMeta extends Readonly<{
    source: string,
    repository: string,
    task: string,
}> {
}

export function isLogMessageMeta(value: unknown): value is LogMessageMeta {
    if (!isObject(value)) return false;
    if (!hasProperty(value, "source")) return false;
    if (!isString(value.source)) return false;
    if (!hasProperty(value, "repository")) return false;
    if (!isString(value.repository)) return false;
    if (!hasProperty(value, "task")) return false;
    return isString(value.task);
}

export interface LogMessage extends Readonly<{
    level: string,
    message: string,
    meta: LogMessageMeta,
}> {
}