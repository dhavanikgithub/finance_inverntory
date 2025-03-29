const { exec } = require("child_process");

console.log("Starting Next.js application...");

// Run the npm start command
const process = exec("npm run start", { cwd: __dirname });

process.stdout.on("data", (data) => {
  console.log(data.toString());
});

process.stderr.on("data", (data) => {
  console.error(data.toString());
});

process.on("close", (code) => {
  console.log(`Process exited with code ${code}`);
});
