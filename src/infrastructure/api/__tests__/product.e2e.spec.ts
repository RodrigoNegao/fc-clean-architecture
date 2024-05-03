import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Chocolate",
        type: "a",
        price: 1000,
      });
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Chocolate");
    expect(response.body.price).toBe(1000);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Chocolate",
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name:"Chocolate",
        type: "a",
        price: 1000,
    });
    expect(response.status).toBe(200);
    
    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Chocolate2",
        type: "b",
        price: 2000,
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    expect(listResponse.body.products[0].name).toBe("Chocolate");
    expect(listResponse.body.products[0].price).toBe(1000);
    expect(listResponse.body.products[1].name).toBe("Chocolate2");
    expect(listResponse.body.products[1].price).toBe(4000);

    const listResponseXML = await request(app)
    .get("/product")
    .set("Accept", "application/xml")
    .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Chocolate</name>`);
    expect(listResponseXML.text).toContain(`<price>1000</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Chocolate2</name>`);
    expect(listResponseXML.text).toContain(`<price>4000</price>`);
    expect(listResponseXML.text).toContain(`</products>`);
    

    
  });
});
