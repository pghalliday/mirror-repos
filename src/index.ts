import "reflect-metadata";
import {container} from "tsyringe";
import {configure} from "./configure";
import {sync as githubSync} from "./github";

configure(container, process.argv[2] || "config.json");
githubSync(container);