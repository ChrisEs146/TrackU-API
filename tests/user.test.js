import User from "../src/models/user";
import app from "../src/app";
import mongoose from "mongoose";
import supertest from "supertest";
import { signUp, signIn } from "./mockData/userMockData";
import { createUser } from "./mockData/userMockData";

beforeEach(async () => {
  await User.deleteMany();
});

// SIGN UP TESTS
describe("User", () => {
  describe("Successful sign up", () => {
    it("Should return status 201", async () => {
      await supertest(app).post("/users/signup").send(signUp.valid).expect(201);
    });
  });
});

describe("User", () => {
  describe("Sign up with empty data", () => {
    it("Should return status 400", async () => {
      const { body } = await supertest(app).post("/users/signup").send(signUp.empty).expect(400);
      expect(body.message).toBe("Fields cannot be empty");
    });
  });
});

describe("User", () => {
  describe("Sign up with invalid name", () => {
    it("Should return status 400", async () => {
      const { body } = await supertest(app)
        .post("/users/signup")
        .send(signUp.invalidName)
        .expect(400);
      expect(body.message).toBe("Fullname should have at least 4 characters");
    });
  });
});

describe("User", () => {
  describe("Sign up with invalid email", () => {
    it("Should return status 400", async () => {
      const { body } = await supertest(app)
        .post("/users/signup")
        .send(signUp.invalidEmail)
        .expect(400);
      expect(body.message).toBe("Invalid Email");
    });
  });
});

describe("User", () => {
  describe("Sign up with invalid password", () => {
    it("Should return status 400", async () => {
      const { body } = await supertest(app)
        .post("/users/signup")
        .send(signUp.invalidPassword)
        .expect(400);
      expect(body.message).toBe("Invalid Password");
    });
  });
});

describe("User", () => {
  describe("Sign up with mismatched passwords", () => {
    it("Should return status 400", async () => {
      const { body } = await supertest(app)
        .post("/users/signup")
        .send(signUp.passwordMisMatch)
        .expect(400);
      expect(body.message).toBe("Passwords do not match");
    });
  });
});

describe("User", () => {
  describe("Sign up existing user", () => {
    it("Should return status 400", async () => {
      await createUser();
      const { body } = await supertest(app).post("/users/signup").send(signUp.valid).expect(409);
      expect(body.message).toBe("User already exists");
    });
  });
});

// SIGN IN TESTS

describe("User", () => {
  describe("Successful sign in", () => {
    it("Should return status 200", async () => {
      await createUser();
      await supertest(app).post("/users/signin").send(signIn.valid).expect(200);
    });
  });
});

describe("User", () => {
  describe("Sign in with empty data", () => {
    it("Should return status 400", async () => {
      const { body } = await supertest(app).post("/users/signin").send(signIn.empty).expect(400);
      expect(body.message).toBe("Fields cannot be empty");
    });
  });
});

describe("User", () => {
  describe("Sign in without existing user", () => {
    it("Should return status 404", async () => {
      const { body } = await supertest(app).post("/users/signin").send(signIn.valid).expect(404);
      expect(body.message).toBe("User does not exist");
    });
  });
});

describe("User", () => {
  describe("Sign in with incorrect password", () => {
    it("Should return status 401", async () => {
      await createUser();
      const { body } = await supertest(app)
        .post("/users/signin")
        .send(signIn.invalidCredentials)
        .expect(401);
      expect(body.message).toBe("Invalid Credentials");
    });
  });
});

// UPDATE NAME TESTS

describe("User", () => {
  describe("Successful name update", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .patch("/users/update-user")
        .set("Authorization", `Bearer ${token}`)
        .send({ newFullName: "Rick Doe" })
        .expect(200);
      expect(body.fullName).toBe("Rick Doe");
    });
  });
});

describe("User", () => {
  describe("Name update with empty data", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .patch("/users/update-user")
        .set("Authorization", `Bearer ${token}`)
        .send({ newFullName: "" })
        .expect(400);
      expect(body.message).toBe("Fields cannot be empty");
    });
  });
});

describe("User", () => {
  describe("Name update without auth", () => {
    it("Should return status 401", async () => {
      const { body } = await supertest(app)
        .patch("/users/update-user")
        .send({ newFullName: "Rick Doe" })
        .expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

describe("User", () => {
  describe("Name update with invalid name", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .patch("/users/update-user")
        .set("Authorization", `Bearer ${token}`)
        .send({ newFullName: "Ric" })
        .expect(400);
      expect(body.message).toBe("Fullname should have at least 4 characters");
    });
  });
});

// UPDATE PASSWORD TESTS

describe("User", () => {
  describe("Successful password update", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .patch("/users/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: signUp.valid.password,
          newPassword: "tl99S271d6n1%5",
          confirmPassword: "tl99S271d6n1%5",
        })
        .expect(200);
      expect(body.message).toBe("Password updated successfully");
    });
  });
});

describe("User", () => {
  describe("Password update with empty data", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .patch("/users/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        .expect(400);
      expect(body.message).toBe("Fields cannot be empty");
    });
  });
});

describe("User", () => {
  describe("Password update with mismatched passwords", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .patch("/users/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: signUp.valid.password,
          newPassword: "tl99S271d6n1%5",
          confirmPassword: "tl99S271d6n1%5d3",
        })
        .expect(400);
      expect(body.message).toBe("Passwords do not match");
    });
  });
});

describe("User", () => {
  describe("Password update with incorrect password", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .patch("/users/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "password71%14",
          newPassword: "tl99S271d6n1%5",
          confirmPassword: "tl99S271d6n1%5",
        })
        .expect(400);
      expect(body.message).toBe("Invalid Password");
    });
  });
});

describe("User", () => {
  describe("Password update with invalid password", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .patch("/users/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: signUp.valid.password,
          newPassword: "tl9",
          confirmPassword: "tl9",
        })
        .expect(400);
      expect(body.message).toBe("Invalid Password");
    });
  });
});

describe("User", () => {
  describe("Password update without auth", () => {
    it("Should return status 401", async () => {
      const { body } = await supertest(app)
        .patch("/users/update-password")
        .send({
          currentPassword: signUp.valid.password,
          newPassword: "tl99S271d6n1%5",
          confirmPassword: "tl99S271d6n1%5d3",
        })
        .expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});
// DELETE USER TESTS

describe("User", () => {
  describe("Successful user deletion", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      await supertest(app)
        .delete("/users/delete-user")
        .set("Authorization", `Bearer ${token}`)
        .send(signIn.valid)
        .expect(200);
    });
  });
});

describe("User", () => {
  describe("User deletion with empty data", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .delete("/users/delete-user")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "", password: "" })
        .expect(400);
      expect(body.message).toBe("Fields cannot be empty");
    });
  });
});

describe("User", () => {
  describe("User deletion with incorrect email", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .delete("/users/delete-user")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "frank@email.com", password: signIn.valid.password })
        .expect(404);
      expect(body.message).toBe("User not found");
    });
  });
});

describe("User", () => {
  describe("User deletion with incorrect password", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .delete("/users/delete-user")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: signIn.valid.email, password: "password12%" })
        .expect(400);
      expect(body.message).toBe("Invalid Credentials");
    });
  });
});

describe("User", () => {
  describe("User deletion without auth", () => {
    it("Should return status 401", async () => {
      const { body } = await supertest(app)
        .delete("/users/delete-user")
        .send(signIn.valid)
        .expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});
// GET USER INFO TESTS

describe("User", () => {
  describe("Get user info withou auth", () => {
    it("Should return status 401", async () => {
      const { body } = await supertest(app).get("/users/info").expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

describe("User", () => {
  describe("Successfully getting user info", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      await supertest(app).get("/users/info").set("Authorization", `Bearer ${token}`).expect(200);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
