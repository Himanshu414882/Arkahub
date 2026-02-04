const http = require("http");
const crypto = require("crypto");

const API_PATH = "/device/real/query";
const HOST = "localhost";
const PORT = 3000;
const TOKEN = "interview_token_123";

function md5(value) {
  return crypto.createHash("md5").update(value).digest("hex");
}

function postBatch(sn_list) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now().toString();

    // 🔑 MUST use path only
    const signature = md5(API_PATH + TOKEN + timestamp);

    const payload = JSON.stringify({ sn_list });

    const options = {
      hostname: HOST,
      port: PORT,
      path: API_PATH,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "Timestamp": timestamp,
        "Signature": signature,
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          const err = new Error(`HTTP ${res.statusCode}`);
          err.statusCode = res.statusCode;
          reject(err);
        }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

module.exports = { postBatch };
