import { Application, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import { logger } from "./logger";

const option: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning App API",
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          schema: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // Memastikan Authorization selalu diatas
    tags: [
      {
        name: "Authotization",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(option);

function swaggerDocs(app: Application, port: number | string) {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
