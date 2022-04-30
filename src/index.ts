import "reflect-metadata";
import {container} from "tsyringe";
import {configure} from "./configure";
import {Github} from "./github";
import {LOGGER} from "./symbols";
import {Logger} from "winston";

export function main(argv: string[]) {
    configure(container, argv[2] || "config.json");
    const logger = container.resolve<Logger>(LOGGER);
    const github = container.resolve(Github);
    github.sync().subscribe({
        next: logger.log.bind(logger),
        error: error => logger.error(
            "unexpected error",
            error,
        ),
        complete: () => logger.log("info", "complete"),
    });
}
