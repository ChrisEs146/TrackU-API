import app from "../src/app";
import mongoose from "mongoose";
import supertest from "supertest";
import Project from "../src/models/project";
import User from "../src/models/user";
import { createUser } from "./mockData/userMockData";
import { projectData } from "./mockData/projectMockData";

beforeEach(async () => {
  await User.deleteMany();
  await Project.deleteMany();
});

// GETTING PROJECTS
describe("Project", () => {
  describe("Successfully get all projects", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .get("/projects")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(Array.isArray(body)).toBe(true);
    });
  });
});

describe("Project", () => {
  describe("Getting all projects without auth", () => {
    it("Should return status 401", async () => {
      const { body } = await supertest(app).get("/projects").expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

// ADDING PROJECTS

describe("Project", () => {
  describe("Successfully adds a project", () => {
    it("Should return status 201", async () => {
      const { token } = await createUser();
      await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid)
        .expect(201);
    });
  });
});

describe("Project", () => {
  describe("Add a project with empty data", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.empty)
        .expect(400);
      expect(body.message).toBe("Fields cannot be empty");
    });
  });
});

describe("Project", () => {
  describe("Add a project with short invalid title", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.invalidTitleShort)
        .expect(400);
      expect(body.message).toBe("Title should have at least 4 characters");
    });
  });
});

describe("Project", () => {
  describe("Add a project with long invalid title", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.invalidTitleLong)
        .expect(400);
      expect(body.message).toBe("Title cannot have more than 50 characters");
    });
  });
});

describe("Project", () => {
  describe("Add a project with short invalid description", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.invalidDescriptionShort)
        .expect(400);
      expect(body.message).toBe("Description cannot have less than 4 characters");
    });
  });
});

describe("Project", () => {
  describe("Add a project with long invalid description", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.invalidDescriptionLong)
        .expect(400);
      expect(body.message).toBe("Description cannot have more than 800 characters");
    });
  });
});

describe("Project", () => {
  describe("Add a project without auth", () => {
    it("Should return status 401", async () => {
      const { body } = await supertest(app).post("/projects").send(projectData.valid).expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

// GETTING PROJECT

describe("Project", () => {
  describe("Successfully getting a project", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .get(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(body._id).toBe(project._id);
    });
  });
});

describe("Project", () => {
  describe("Getting a project with invalid ID", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .get(`/projects/${project._id.concat(457)}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(body.message).toBe("Project ID is not valid");
    });
  });
});

describe("Project", () => {
  describe("Getting a nonexistent project", () => {
    it("Should return status 404", async () => {
      const projectId = new mongoose.Types.ObjectId();
      const { token } = await createUser();
      const { body } = await supertest(app)
        .get(`/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      expect(body.message).toBe("Project not found");
    });
  });
});

describe("Project", () => {
  describe("Getting a project with invalid user", () => {
    it("Should return status 401", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { token: secondToken } = await createUser(true);
      const { body } = await supertest(app)
        .get(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${secondToken}`)
        .expect(401);
      expect(body.message).toBe("User not authorized");
    });
  });
});

describe("Project", () => {
  describe("Get a project without auth", () => {
    it("Should return status 401", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app).get(`/projects/${project._id}`).expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

// UPDATING PROJECT

describe("Project", () => {
  describe("Successful project update", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.validUpdate)
        .expect(200);
    });
  });
});

describe("Project", () => {
  describe("Update a project with empty data", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.emptyUpdate)
        .expect(400);
      expect(body.message).toBe("Fields cannot be empty");
    });
  });
});

describe("Project", () => {
  describe("Update a project with short invalid title", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.invalidUpdateShortTitle)
        .expect(400);
      expect(body.message).toBe("Title should have at least 4 characters");
    });
  });
});

describe("Project", () => {
  describe("Update a project with long invalid title", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.invalidUpdateLongTitle)
        .expect(400);
      expect(body.message).toBe("Title cannot have more than 50 characters");
    });
  });
});

describe("Project", () => {
  describe("Update a project with short invalid description", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.invalidUpdateShortDescription)
        .expect(400);
      expect(body.message).toBe("Description cannot have less than 4 characters");
    });
  });
});

describe("Project", () => {
  describe("Update a project with short long description", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.invalidUpdateLongDescription)
        .expect(400);
      expect(body.message).toBe("Description cannot have more than 800 characters");
    });
  });
});

describe("Project", () => {
  describe("Update a project with invalid status", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.invalidStatus)
        .expect(400);
      expect(body.message).toBe(`${projectData.invalidStatus.status} is not supported`);
    });
  });
});

describe("Project", () => {
  describe("Update a project with valid status 1 (Completed)", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.validStatus1)
        .expect(200);
    });
  });
});

describe("Project", () => {
  describe("Update a project with valid status 2 (In Progress)", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.validStatus2)
        .expect(200);
    });
  });
});

describe("Project", () => {
  describe("Update a project with valid status 3 (Not Started)", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.validStatus3)
        .expect(200);
    });
  });
});

describe("Project", () => {
  describe("Update a project with valid progress", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.validProgress)
        .expect(200);
    });
  });
});

describe("Project", () => {
  describe("Update a project with low invalid progress", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.inValidProgressLow)
        .expect(400);
      expect(body.message).toBe("Progress cannot be less than 0");
    });
  });
});

describe("Project", () => {
  describe("Update a project with high invalid progress", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.inValidProgressHigh)
        .expect(400);
      expect(body.message).toBe("Progress cannot be more than 100");
    });
  });
});

describe("Project", () => {
  describe("Update a project with invalid Project ID", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id.concat(467)}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.validUpdate)
        .expect(400);
      expect(body.message).toBe("Project ID is not valid");
    });
  });
});

describe("Project", () => {
  describe("Update a nonexisting project", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const projectId = new mongoose.Types.ObjectId();

      const { body } = await supertest(app)
        .put(`/projects/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.validUpdate)
        .expect(404);
      expect(body.message).toBe("Project not found");
    });
  });
});

describe("Project", () => {
  describe("Update a project with invalid user", () => {
    it("Should return status 401", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { token: secondToken } = await createUser(true);
      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .set("Authorization", `Bearer ${secondToken}`)
        .send(projectData.validUpdate)
        .expect(401);
      expect(body.message).toBe("User not authorized");
    });
  });
});

describe("Project", () => {
  describe("Update a project without auth", () => {
    it("Should return status 401", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .put(`/projects/${project._id}`)
        .send(projectData.validUpdate)
        .expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

// DELETING PROJECT

afterAll(async () => {
  await mongoose.connection.close();
});
