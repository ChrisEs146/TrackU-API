import app from "../src/app";
import mongoose from "mongoose";
import supertest from "supertest";
import Project from "../src/models/project";
import User from "../src/models/user";
import Update from "../src/models/update";
import { createUser } from "./mockData/userMockData";
import { projectData } from "./mockData/projectMockData";
import { updateData } from "./mockData/updateMockData";

beforeEach(async () => {
  await User.deleteMany();
  await Project.deleteMany();
  await Update.deleteMany();
});

// GETTING UPDATES

describe("Update", () => {
  describe("Successfully get all updates from a project", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .get(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(Array.isArray(body)).toBe(true);
    });
  });
});

describe("Update", () => {
  describe("Get all updates with invalid ID", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .get(`/updates/${project._id.concat(467)}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(body.message).toBe("Project ID is not valid");
    });
  });
});

describe("Update", () => {
  describe("Get all updates from nonexisting project", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const projectId = new mongoose.Types.ObjectId();

      const { body } = await supertest(app)
        .get(`/updates/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      expect(body.message).toBe("Parent project not found");
    });
  });
});

describe("Update", () => {
  describe("Getting all updates without auth", () => {
    it("Should return status 401", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app).get(`/updates/${project._id}`).expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});
// ADDING UPDATE

describe("Update", () => {
  describe("Successfully add update", () => {
    it("Should return status 201", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid)
        .expect(201);
    });
  });
});

describe("Update", () => {
  describe("Add update with empty data", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.empty)
        .expect(400);
      expect(body.message).toBe("Fields cannot be empty");
    });
  });
});

describe("Update", () => {
  describe("Add update with short invalid title", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.invalidShortTitle)
        .expect(400);
      expect(body.message).toBe("Title should have at least 4 characters");
    });
  });
});

describe("Update", () => {
  describe("Add update with long invalid title", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.invalidLongTitle)
        .expect(400);
      expect(body.message).toBe("Title cannot have more than 50 characters");
    });
  });
});

describe("Update", () => {
  describe("Add update with short invalid description", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.invalidShortDescription)
        .expect(400);
      expect(body.message).toBe("Description cannot have less than 4 characters");
    });
  });
});

describe("Update", () => {
  describe("Add update with long invalid description", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.invalidLongDescription)
        .expect(400);
      expect(body.message).toBe("Description cannot have more than 800 characters");
    });
  });
});

describe("Update", () => {
  describe("Add update to nonexisting project", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const projectId = new mongoose.Types.ObjectId();

      const { body } = await supertest(app)
        .post(`/updates/${projectId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid)
        .expect(404);
      expect(body.message).toBe("Parent project not found");
    });
  });
});

describe("Update", () => {
  describe("Add update without auth", () => {
    it("Should return status 401", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body } = await supertest(app)
        .post(`/updates/${project._id}`)
        .send(updateData.valid)
        .expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

// GETTING UPDATE

describe("Update", () => {
  describe("Successfully getting update", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      await supertest(app)
        .get(`/updates/project/${project._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
});

describe("Update", () => {
  describe("Get update with invalid project ID", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .get(`/updates/project/${project._id.concat(465)}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(body.message).toBe("Project ID is not valid");
    });
  });
});

describe("Update", () => {
  describe("Get update with invalid update ID", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .get(`/updates/project/${project._id}/update/${update._id.concat(465)}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(body.message).toBe("Update ID is not valid");
    });
  });
});

describe("Update", () => {
  describe("Get update from nonexisting project", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const projectId2 = new mongoose.Types.ObjectId();

      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .get(`/updates/project/${projectId2}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      expect(body.message).toBe("Parent project not found");
    });
  });
});

describe("Update", () => {
  describe("Get update from nonexisting update", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const updateId = new mongoose.Types.ObjectId();
      const { body } = await supertest(app)
        .get(`/updates/project/${project._id}/update/${updateId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      expect(body.message).toBe("Update not found");
    });
  });
});

describe("Update", () => {
  describe("Get update from unauth project", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: project2 } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .get(`/updates/project/${project2._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(body.message).toBe("Unauthorized Update");
    });
  });
});

describe("Update", () => {
  describe("Get update without auth", () => {
    it("Should return status 401", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .get(`/updates/project/${project._id}/update/${update._id}`)
        .expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});
// EDITING UPDATE

describe("Update", () => {
  describe("Successfully editing an update", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      await supertest(app)
        .put(`/updates/project/${project._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.validEdit)
        .expect(200);
    });
  });
});

describe("Update", () => {
  describe("Edit update with empty data", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${project._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.empty)
        .expect(400);
      expect(body.message).toBe("Fields cannot be empty");
    });
  });
});

describe("Update", () => {
  describe("Edit update with short invalid title", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${project._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.invalidShortTitle)
        .expect(400);
      expect(body.message).toBe("Title should have at least 4 characters");
    });
  });
});

describe("Update", () => {
  describe("Edit update with long invalid title", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${project._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.invalidLongTitle)
        .expect(400);
      expect(body.message).toBe("Title cannot have more than 50 characters");
    });
  });
});

describe("Update", () => {
  describe("Edit update with short invalid description", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${project._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.invalidShortDescription)
        .expect(400);
      expect(body.message).toBe("Description cannot have less than 4 characters");
    });
  });
});

describe("Update", () => {
  describe("Edit update with long invalid description", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${project._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.invalidLongDescription)
        .expect(400);
      expect(body.message).toBe("Description cannot have more than 800 characters");
    });
  });
});

describe("Update", () => {
  describe("Edit update with invalid project ID", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${project._id.concat(465)}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.validEdit)
        .expect(400);
      expect(body.message).toBe("Project ID is not valid");
    });
  });
});

describe("Update", () => {
  describe("Edit update with invalid update ID", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${project._id}/update/${update._id.concat(465)}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.validEdit)
        .expect(400);
      expect(body.message).toBe("Update ID is not valid");
    });
  });
});

describe("Update", () => {
  describe("Edit update from nonexisting project", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const projectId2 = new mongoose.Types.ObjectId();

      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${projectId2}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.validEdit)
        .expect(404);
      expect(body.message).toBe("Parent project not found");
    });
  });
});

describe("Update", () => {
  describe("Edit update from nonexisting update", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const updateId = new mongoose.Types.ObjectId();
      const { body } = await supertest(app)
        .put(`/updates/project/${project._id}/update/${updateId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.validEdit)
        .expect(404);
      expect(body.message).toBe("Update not found");
    });
  });
});

describe("Update", () => {
  describe("Edit update from unauth project", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: project2 } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${project2._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.validEdit)
        .expect(400);
      expect(body.message).toBe("Unauthorized Update");
    });
  });
});

describe("Update", () => {
  describe("Edit update without auth", () => {
    it("Should return status 401", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .put(`/updates/project/${project._id}/update/${update._id}`)
        .send(updateData.validEdit)
        .expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

// DELETING UPDATE

describe("Update", () => {
  describe("Successfully deleting update", () => {
    it("Should return status 200", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .delete(`/updates/project/${project._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
      expect(body.message).toBe("Update was deleted successfully");
    });
  });
});

describe("Update", () => {
  describe("Delete update with invalid project ID", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .delete(`/updates/project/${project._id.concat(465)}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(body.message).toBe("Project ID is not valid");
    });
  });
});

describe("Update", () => {
  describe("Delete update with invalid update ID", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .delete(`/updates/project/${project._id}/update/${update._id.concat(465)}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(body.message).toBe("Update ID is not valid");
    });
  });
});

describe("Update", () => {
  describe("Delete update from nonexisting project", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const projectId2 = new mongoose.Types.ObjectId();

      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .delete(`/updates/project/${projectId2}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      expect(body.message).toBe("Parent project not found");
    });
  });
});

describe("Update", () => {
  describe("Delete update from nonexisting update", () => {
    it("Should return status 404", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const updateId = new mongoose.Types.ObjectId();
      const { body } = await supertest(app)
        .delete(`/updates/project/${project._id}/update/${updateId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
      expect(body.message).toBe("Update not found");
    });
  });
});

describe("Update", () => {
  describe("Delete update from unauth project", () => {
    it("Should return status 400", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: project2 } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .delete(`/updates/project/${project2._id}/update/${update._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
      expect(body.message).toBe("Unauthorized Update");
    });
  });
});

describe("Update", () => {
  describe("Delete update without auth", () => {
    it("Should return status 401", async () => {
      const { token } = await createUser();
      const { body: project } = await supertest(app)
        .post("/projects")
        .set("Authorization", `Bearer ${token}`)
        .send(projectData.valid);

      const { body: update } = await supertest(app)
        .post(`/updates/${project._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData.valid);

      const { body } = await supertest(app)
        .delete(`/updates/project/${project._id}/update/${update._id}`)
        .expect(401);
      expect(body.message).toBe("Unauthorized");
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
