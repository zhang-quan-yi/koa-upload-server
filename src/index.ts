import http, { IncomingMessage, ServerResponse } from "http";
import asyncBusboy from "async-busboy";
import path from "path";
import fs from "fs";

const PORT = 8801;

const handleRequest = async (
  request: IncomingMessage,
  response: ServerResponse
) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, OPTIONS"
  );
  if (request.method == "OPTIONS") {
    response.statusCode = 200;
    response.end("Hello!");
    return;
  }
  const route = request.url;
  console.log("request in");
  if (request.method === "GET") {
    console.log("method [GET]");
    if (route === "/test") {
      response.statusCode = 200;
      response.end("Hello!");
      return;
    }
  }
  if (request.method === "POST") {
    console.log("method [POST]");
    if (route === "/upload") {
      console.log("path", route);
      try {
        const { files, fields } = await asyncBusboy(request);
        response.writeHead(200, { "Content-Type": "application/json" });
        const file = files[0] as any;
        var saveTo = path.join(__dirname, "../uploads/" + file.filename);
        file.pipe(fs.createWriteStream(saveTo));
        if (file) {
          response.end(
            JSON.stringify({
              data: {
                name: file.filename,
                path: file.path,
                url: "/uploads/" + file.filename,
              },
            })
          );
        } else {
          response.end(
            JSON.stringify({
              data: null,
            })
          );
        }

        return;
      } catch (e) {
        response.end("something error: " + e);
        return;
      }
    }
  }
  response.end("unhandle!");
};

var server = http.createServer(handleRequest);
server.listen(PORT, function () {
  console.log("Server listening on: http://localhost:%s", PORT);
});
