import request from "supertest";
import app from "../src/index";
import { vi } from "vitest";
import User from "../src/models/user.model";

vi.mock("../src/models/user.model.ts");

describe("POST /api/auth/login", () => {
  it("should return 200 for valid login credentials", async () => {
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

    vi.spyOn(User, "findOne").mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "jane@test.com", password: "123456" });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
  });
});
