import "reflect-metadata";
import {container} from "tsyringe";
import {configure} from "./configure";
import {Github} from "./github";
import {CONFIG} from "./symbols";
import {createLogger, format, transports} from "winston";
import {Config} from "./types/Config";
import {isLogMessageMeta} from "./types/LogMessage";

configure(container, process.argv[2] || "config.json");
const config = container.resolve<Config>(CONFIG);
const logger = createLogger({
    level: config.logLevel,
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
            filename: config.logFile,
        }),
        new transports.Console(),
    ],
});

const github = container.resolve(Github);
github.sync().subscribe({
    next: logger.log.bind(logger),
    error: error => logger.error(
        "unexpected error",
        error,
    ),
    complete: () => logger.log("info", "complete"),
});