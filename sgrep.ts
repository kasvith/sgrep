import * as colors from "https://deno.land/std/fmt/colors.ts";
import * as bufio from "https://deno.land/std/io/bufio.ts";
import { parse, Args } from "https://deno.land/std/flags/mod.ts";

function printUsage() {
  console.log("usage:");
  console.log("\tdeno sgrep.ts [--colors] needle");
}

function normalOutput(needle: string, line: string): void {
  console.log(line);
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function colorOutput(needle: string, line: string): void {
  console.log(
    line.replace(RegExp(escapeRegExp(needle), "g"), colors.red(needle)),
  );
}

async function run(): Promise<void> {
  let outputFn: (n: string, s: string) => void = normalOutput;

  const flags: Args = parse(Deno.args);

  if (flags._.length !== 1) {
    printUsage();
    Deno.exit(1);
  }

  if (flags["colors"] === "true") {
    outputFn = colorOutput;
  }

  const needle: string = flags._[0] as string;
  for await (const line of bufio.readLines(Deno.stdin)) {
    if (line.includes(needle)) {
      outputFn(needle, line);
    }
  }
}

if (import.meta.main) {
  await run();
}
