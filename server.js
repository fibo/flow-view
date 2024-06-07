import { exec } from "child_process";
import { createReadStream } from "fs";
import { access } from "fs/promises";
import { createServer } from "http";
import os from "os";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT ?? 3000;

const fileExtensionToMimeTypeMap = new Map()
  .set("css", "text/css; charset=UTF-8")
  .set("html", "text/html; charset=UTF-8")
  .set("js", "application/javascript");

createServer(async (req, res) => {
  const STATIC_PATH = dirname(fileURLToPath(import.meta.url));
  const pathParts = [STATIC_PATH, req.url];

  if (req.url.endsWith("/")) pathParts.push("index.html");

  const filePath = join(...pathParts);

  const exists = await access(filePath).then(
    () => true,
    () => false
  );

  const sendText = (statusCode, text) => {
    res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
    res.end(text);
  };

  if (!exists) return sendText(404, "Not found");

  const stream = createReadStream(filePath);
  const fileExtension = extname(filePath).substring(1).toLowerCase();
  const mimeType = fileExtensionToMimeTypeMap.get(fileExtension);

  if (!mimeType) return sendText(501, "Not implemented");

  res.writeHead(200, { "Content-Type": mimeType });
  stream.pipe(res);
}).listen(PORT, () => {
  const localAddress = `http://localhost:${PORT}`;
  console.info(`Server started on ${localAddress}`);
  const platform = os.platform();
  if (platform === "darwin") exec(`open ${localAddress}`);
  if (platform === "linux") exec(`xdg-open ${localAddress}`);
  if (platform === "win32") exec(`start ${localAddress}`);
});
