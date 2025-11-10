import express from "express";
import request from "supertest";
import tokensRouter from "../src/routes/tokens";

const app = express();
app.use("/tokens", tokensRouter);

jest.setTimeout(20000);

test("GET /tokens returns valid response", async () => {
  const res = await request(app).get("/tokens?q=doge&limit=3");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("data");
  expect(Array.isArray(res.body.data)).toBe(true);
});

test("GET /tokens handles missing query gracefully", async () => {
  const res = await request(app).get("/tokens");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("data");
});
