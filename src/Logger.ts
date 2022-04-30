import {inject, singleton} from "tsyringe";
import {CONFIG} from "./symbols";
import {Config} from "./types/Config";
import winston, {createLogger, format, transports} from "winston";
import {isLogMessageMeta} from "./types/LogMessage";

@singleton()
export class Logger {
    constructor(
        @inject(CONFIG) private readonly config: Config,
    ) {
    }

    get(): winston.Logger {
        return createLogger({
            level: this.config.logLevel,
            format: format.combine(
                format.timestamp(),
                format.printf(
                    ({timestamp, level, message, meta}) => {
                        if (meta !== undefined) {
                            if (isLogMessageMeta(meta)) {
                                return `${timestamp} [${level}] ${meta.source}: ${meta.repository}: ${meta.task}: ${message}`;
                            }
                            return `${timestamp} [${level}] ${message}: ${meta}`;
                        }
                        return `${timestamp} [${level}] ${message}`;
                    },
                ),
            ),
            transports: [
                new transports.File({
                    filename: this.config.logFile,
                }),
                new transports.Console(),
            ],
        });
    }
}