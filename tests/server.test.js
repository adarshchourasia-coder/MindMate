import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import bodyParser from "body-parser";
import crisisDetection from "../middleware/crisisDetection.js";
import chatRoutes from "../routes/chatRoutes.js";
import journalRoutes from "../routes/journalRoutes.js";
import JournalEntry from "../models/JournalEntry.js";

jest.setTimeout(30000);

let mongod;
let app;
let server;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app = express();
  app.use(bodyParser.json());

  // Attach crisisDetection middleware only to /chat POST
  app.use("/chat", crisisDetection);
  app.use("/chat", chatRoutes);
  app.use("/journal", journalRoutes);

  // Error handler
  app.use((err, req, res, next) => {
    res.status(500).json({ error: "Internal server error" });
  });

  server = app.listen();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  server.close();
});

describe("Crisis Detection Middleware", () => {
  test("Detects crisis keyword and sets req.crisis true", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ message: "I want to kill myself" });
    expect(res.body.crisis).toBe(true);
    expect(res.body.hotline).toBeDefined();
    expect(res.body.reply).toMatch(/difficult time/i);
  });

  test("Does not detect crisis when no keywords present", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ message: "Hello, how are you?" });
    expect(res.body.crisis).toBe(false);
    expect(res.body.reply).toBeDefined();
  });
});

describe("POST /chat endpoint", () => {
  test("Returns error for missing message", async () => {
    const res = await request(app).post("/chat").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("Returns crisis response when crisis detected", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ message: "I am feeling suicidal" });
    expect(res.body.crisis).toBe(true);
    expect(res.body.hotline).toBeDefined();
  });
});

describe("POST /journal/add endpoint", () => {
  test("Adds a valid journal entry", async () => {
    const entryData = {
      userId: "testuser",
      moodRating: 7,
      journalText: "Feeling okay today."
    };
    const res = await request(app).post("/journal/add").send(entryData);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.entry).toMatchObject({
      userId: "testuser",
      moodRating: 7,
      journalText: "Feeling okay today."
    });
  });

  test("Returns error for invalid moodRating", async () => {
    const entryData = {
      userId: "testuser",
      moodRating: 11,
      journalText: "Invalid mood rating."
    };
    const res = await request(app).post("/journal/add").send(entryData);
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe("GET /journal/history endpoint", () => {
  test("Returns journal entries for user", async () => {
    // Add entries first
    await JournalEntry.create([
      { userId: "user1", moodRating: 5, journalText: "Entry 1" },
      { userId: "user1", moodRating: 8, journalText: "Entry 2" }
    ]);

    const res = await request(app).get("/journal/history").query({ userId: "user1" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.entries)).toBe(true);
    expect(res.body.entries.length).toBeGreaterThanOrEqual(2);
    expect(res.body.entries[0].userId).toBe("user1");
  });

  test("Returns error for missing userId", async () => {
    const res = await request(app).get("/journal/history");
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
