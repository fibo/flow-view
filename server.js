import { exec } from "child_process";
import { createReadStream } from "fs";
import { access, readFile } from "fs/promises";
import { createServer } from "http";
import os from "os";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT ?? 3000;

const pkg = await readFile("./package.json").then(JSON.parse);
const basePathname = new URL(pkg.homepage).pathname.split("/")[1];

const baseUrl = `http://localhost:${PORT}/${basePathname == "" ? "" : `${basePathname}/`}`;

const fileExtensionToMimeTypeMap = new Map()
  .set("css", "text/css; charset=UTF-8")
  .set("html", "text/html; charset=UTF-8")
  .set("js", "application/javascript");

createServer(async (req, res) => {
  const STATIC_PATH = dirname(fileURLToPath(import.meta.url));

  const url = req.url
    .split("/")
    .filter((part) => part != basePathname)
    .join("/");
  const pathParts = [STATIC_PATH, url];

  if (url.endsWith("/")) pathParts.push("index.html");

  let filePath = join(...pathParts);

  const exists = await access(filePath).then(
    () => true,
    () => false,
  );

  const sendText = (statusCode, text) => {
    res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
    res.end(text);
  };

  const fileExtension = extname(filePath).substring(1).toLowerCase();
  let mimeType = fileExtensionToMimeTypeMap.get(fileExtension);

  if (fileExtension && !mimeType) return sendText(501, "Not implemented");

  if (!exists) {
    if (mimeType) return sendText(404, "Not found");
    filePath = join(STATIC_PATH, "404.html");
    mimeType = "html";
  }

  const stream = createReadStream(filePath);

  res.writeHead(200, { "Content-Type": mimeType });
  stream.pipe(res);
}).listen(PORT, () => {
  console.info(`Server started on ${baseUrl}`);
  const platform = os.platform();
  if (platform === "darwin") exec(`open ${baseUrl}`);
  if (platform === "linux") exec(`xdg-open ${baseUrl}`);
  if (platform === "win32") exec(`start ${baseUrl}`);
});
