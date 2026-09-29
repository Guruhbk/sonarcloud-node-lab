const request = require("supertest");
const app = require("../app");

describe("SonarCloud Learning Lab", () => {

    test("GET /adult/25 should return Adult", async () => {
        const response = await request(app)
            .get("/adult/25");

        expect(response.text).toBe("Adult");
    });

    test("GET /adult/10 should return Not adult", async () => {
        const response = await request(app)
            .get("/adult/10");

        expect(response.text).toBe("Not adult");
    });

});