const { postRequest } = require("./apiClient");
const RateLimiter = require("./rateLimiter");

const limiter = new RateLimiter(1000);

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function fetchBatch(serialNumbers, retries = 3) {
  try {
    return await limiter.enqueue(() =>
      postRequest({ serialNumbers })
    );
  } catch (err) {
    if (retries > 0 && (err.statusCode === 429 || !err.statusCode)) {
      console.warn("Retrying batch...", serialNumbers);
      return fetchBatch(serialNumbers, retries - 1);
    }
    throw err;
  }
}

async function aggregateData() {
  const serialNumbers = Array.from({ length: 500 }, (_, i) =>
    `SN-${i.toString().padStart(3, "0")}`
  );

  const batches = chunkArray(serialNumbers, 10);
  const result = {};

  for (const batch of batches) {
    const response = await fetchBatch(batch);
    response.data.forEach((device) => {
      result[device.serialNumber] = device;
    });
  }

  return result;
}

module.exports = { aggregateData };
