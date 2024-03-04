const request = require("supertest");
const app = require("../app"); // Załóżmy, że to plik główny Twojej aplikacji Express
const mongoose = require("mongoose");

describe("Server initialization", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_HOST, {});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  beforeEach(() => {
    server = app.listen(process.env.PORT);
  });

  afterEach(() => {
    server.close();
  });

  it("signup Test", async () => {
    const response = await request(app).post("/api/users/signup").send({
      email: "test1@example.com",
      password: "password123",
    });
    expect(response.status).toBe(201);
    expect(response.body.email).toBeDefined();
    expect(typeof response.body.email).toBe("string");
    expect(response.body.subscription).toBeDefined();
    expect(typeof response.body.subscription).toBe("string");
    expect(typeof response.body.avatarURL).toBeDefined;
    expect(typeof response.body.avatarURL).toBe("string");
  });

  it("login Test", async () => {
    const response = await request(app).post("/api/users/login").send({
        email: "t1ghgdddd@ex2amfp2le.com",
        password: "password123",
    });
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe("string");
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBeDefined();
    expect(typeof response.body.user.email).toBe("string");
    expect(response.body.user.subscription).toBeDefined();
    expect(typeof response.body.user.subscription).toBe("string");
  });

  it("should connect to the database successfully", async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
