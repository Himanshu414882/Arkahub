const { postBatch } = require("./apiClient");
const RateLimiter = require("./rateLimiter");

const limiter = new RateLimiter(1000);

function chunk(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

(async () => {
  const sns = Array.from({ length: 500 }, (_, i) =>
    `SN-${i.toString().padStart(3, "0")}`
  );

  const batches = chunk(sns, 10);
  const aggregated = {};

  for (const batch of batches) {
    const response = await limiter.enqueue(() =>
      postBatch(batch)
    );

    response.data.forEach((d) => {
      aggregated[d.sn] = d;
    });

    console.log(`Fetched ${batch.length} devices`);
  }

  console.log("✅ Done. Total devices:", Object.keys(aggregated).length);
})();
