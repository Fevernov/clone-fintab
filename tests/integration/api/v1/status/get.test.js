import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status"),
  () => {
    describe("Anonymous user"),
      () => {
        test("Retrieving current system status", async () => {
          const response = await fetch("http://localhost:3000/api/v1/status");
          expect(response.status).toBe(200);

          const responseBody = await response.json({});

          const parsedUpdatedAt = new Date(
            responseBody.updated_at,
          ).toISOString();
          expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
          // end of update

          // version of postgres
          expect(responseBody.dependencies.database.version).toEqual("16.0");
          // max connections
          expect(responseBody.dependencies.database.max_connections).toEqual(
            100,
          );
          // opened connections
          expect(responseBody.dependencies.database.opened_connections).toEqual(
            1,
          );
        });
      };
  };
