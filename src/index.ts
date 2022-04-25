import "reflect-metadata";
import {container} from "tsyringe";
import {configure} from "./configure";
import {Github} from "./github";

configure(container, process.argv[2] || "config.json");
const github = container.resolve(Github);
github.sync().subscribe({
    next: console.log,
    error: console.error,
    complete: () => console.log("complete"),
});