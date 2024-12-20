import request from "supertest";
import app from "../src/index";
import { vi } from "vitest";
import User from "../src/models/user.model";

vi.mock("../src/models/user.model.ts");

const mockUser = {
  _id: {
    $oid: "6756d7f2883efddfd2fdab5c",
  },
  email: "admin@test.com",
  firstName: "John",
  lastName: "Doe",
  password: "$2b$10$LC/OneOqkfog2HbZA2gRquHCsXByHvHgw4771Xt2wj6eawlVLhjDO",
  profilePic: "",
  createdAt: {
    $date: "2024-12-09T11:43:46.005Z",
  },
  updatedAt: {
    $date: "2024-12-09T11:43:46.005Z",
  },
  __v: 0,
};

describe("Auth Routes", () => {
  describe("/api/auth/login", () => {
    vi.spyOn(User, "findOne").mockImplementation((query: any): any => {
      if (query.email === "admin@test.com") {
        return Promise.resolve(mockUser);
      } else {
        return Promise.resolve(null);
      }
    });

    it("should return 200 for valid login credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@test.com", password: "123456" });
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should return 400 for invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@test.com", password: "1234563" });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message.message).toBe("Invalid Credentials");
    });

    it("should return 400 if user does not exists", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@test.com", password: "123456" });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message.message).toBe("User does not exists");
    });

    it("should return 400 for missing email field", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ password: "1234563" });
      expect(response.status).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message.message.email._errors[0]).toBe("Required");
    });

    it("should return 400 for missing password field", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin@test.com" });
      expect(response.status).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message.message.password._errors[0]).toBe(
        "Required"
      );
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "jane.com", password: "1234563" });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("error");
      expect(response.body.message.message.email._errors[0]).toBe(
        "Invalid email"
      );
    });
  });

  // describe("/api/auth/signup", () => {
  //   it("should return 200 when signup is successful", async () => {
  //     vi.spyOn(User.prototype, "save").mockRejectedValue(mockUser);

  //     const response = await request(app).post("/api/auth/signup").send({
  //       email: "test@test.com",
  //       firstName: "Test",
  //       lastName: "Test",
  //       password: "123456",
  //       confirmPassword: "123456",
  //     });
  //   });
  // });
});
