import { spawn } from "node:child_process";

type Target = "local" | "staging" | "prod";

const [, , maybeTarget, ...forwardedArgs] = process.argv;
const target = (maybeTarget as Target | undefined) ?? "local";

if (!["local", "staging", "prod"].includes(target)) {
  console.error(`Unknown dev target: ${target}`);
  process.exit(1);
}

const env = { ...process.env };

if (target === "staging") {
  env.AWS_USER = process.env.AWS_STAGING_USER ?? process.env.AWS_USER;
  env.AWS_PASSWORD =
    process.env.AWS_STAGING_PASSWORD ?? process.env.AWS_PASSWORD;
  env.DB_SCHEMA = "dev";
}

if (target === "prod") {
  env.AWS_USER = process.env.AWS_PROD_USER ?? process.env.AWS_USER;
  env.AWS_PASSWORD = process.env.AWS_PROD_PASSWORD ?? process.env.AWS_PASSWORD;
  env.DB_SCHEMA = "public";
}

const isWindows = process.platform === "win32";
const command = isWindows ? "npx.cmd" : "npx";

const child = spawn(command, ["next", "dev", "--turbopack", ...forwardedArgs], {
  stdio: "inherit",
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
