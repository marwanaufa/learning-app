# learning-app

    1. Inisiasi git = git init
    2. Inisiasi npm = npm init -y
    3. Install express = npm i express
    4. Install prisma (cli atau tool cukup di dev) di dev = npm i prisma --save-dev
    5. Install prisma client (runtime tidak boleh di dev) = npm i @prisma/client
    6. Inisiasi prisma = prisma init
    7. Atur schema.prisma dan buang line generated jadi seperti ini
        generator client {
            provider = "prisma-client-js"
        }

    8. Atur file env
        DATABASE_URL="postgresql://user:password@host:port_postgre/nama_db"

        PORT=

        # https://travistidwell.com/jsencrypt/demo/ key size 2048
        JWT_PUBLIC=""
        JWT_PRIVATE=""

    9. Buat file .gitignore
        node_modules
        .env

    10. Install database = npm i pg
    11. Install dotenv (untuk mengambil isi file env menjadi variable process.env) = npm i dotenv
    12. Buat struktur folder project
        src
            config
            middleware
            utils
            types
            validations
            services
            controllers
            routes

    13. Install bcrypt (untuk hashing password) = npm i bcrypt
    14. Install body-parser (untuk memproses data dari http req menjadi variable req.body) = npm i body-parser
    15. Install cors (untuk mengatur yang bisa mengakses aplikasi) = npm i cors
    16. Install joi (untuk validasi) = npm i joi
    17. Install jsonwebtoken (untuk autentikasi) = npm i jsonwebtoken
    18. Install moment (untuk formatting date and time) = npm i moment
    19. Install nodemon (untuk auto-restart jika ada perubahan file) = npm i nodemon
    20. Install pino (untuk logger) = npm i pino
    21. Install pino-pretty (prettier untuk pino) = npm i pino-pretty
    22. Install swagger (terintegrasi dengan node api) = npm install swagger-jsdoc swagger-ui-express express
    23. Install eslint di dev = npm i eslint --save-dev
    24. Install jest (untuk unit test) di dev = npm i jest --save-dev
    25. Install supertest (membantu unit test) di dev = npm i supertest --save-dev
    26. Install typescript di dev = npm i typescript --save-dev
    27. Install ts-jest (integrasi ts dan jest) di dev = npm i ts-jest --save-dev
    28. Definisikan tipe typescript untuk jest dan suppertest di dev = npm i @types/jest @types/supertest --save-dev
    29. Definisikan ruleset dassar untuk eslint di dev = npm i @eslint/js --save-dev
    30. Install globals (agar eslint paham environtment global misal process) di dev = npm i globals --save-dev
    31. Install eslint untuk typescript di dev = npm i typescript-eslint --save-dev
    32. Definisikan parser dan rules untuk eslint khusus TS di dev = npm i @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
    33. Install ts-node dan @types/node (agar file .ts bisa dijalankan tanpa build) di dev = npm i ts-node @types/node --save-dev
    34. Definisikan tipe yang lain untuk typescript di dev
        express, cors, jsonwebtoken, bcrypt, pg, swagger-jsdoc, swagger-ui-express
        npm i @types/express @types/cors @types/jsonwebtoken @types/bcrypt @types/pg @types/swagger-jsdoc @types/swagger-ui-express --save-dev

    35. Kenapa semua yang berhubungan dengan typescript dinstall di dev dependencies?
        Karena typescript adalah bahasa yang hanya digunakan dalam development, setelah building akan menjadi file javascript yang akan dijalankan di production. Beberapa alasannya adalah typescript sendiri adalah superset javascript node.js tidak paham typescript, performance lebih cepat dari pada typescript krn jika menjalankan file .ts server akan compile setiap kali file .ts dijalankan.

    36. Buat file .eslintrs.js
        module.export = {
            root: true,
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint"],
            extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
        };

    37. Generate file tsconfig.json atau generate dengan command = npx tsc --init
        {
            "compilerOptions": {
                "target": "es2016",
                "module": "commonjs",
                "resolveJsonModule": true,
                "outDir": "dist",
                "esModuleInterop": true,
                "forceConsistentCasingInFileNames": true,
                "strict": true,
                "noImplicitAny": true,
                "skipLibCheck": false
            },
            "include": ["src"],
            "exclude": ["node_modules"]
        }

        Jika error sementara biarkan krn belum ada file .ts di include

    38. Buat file config nodemon nodemon.json
        {
            "watch": ["src"],
            "ext": "ts",
            "exec": "npx ts-node ./src/index.ts"
        }

    39. Buat file jest.config.js
        module.exports = {
            preset: "ts-jest",
            testEnvironment: "node",
            testMatch: ["**/**/*.test.ts"],
            verbose: true,
            forceExit: false,
        };

    40. Buat file config terlebih dahulu
        environment.ts

            import "dotenv/config";

            const CONFIG = {
            db: process.env.DATABASE_URL,
            jwt_public: `${process.env.JWT_PUBLIC}`,
            jwt_private: `${process.env.JWT_PRIVATE}`,
            };

            export default CONFIG;

    41. Lalu buat file utils
        dateTime.ts

            export const dateNow = () => {
                let localTime: Date = new Date();

                let offset: number = localTime.getTimezoneOffset();
                let serverTime: string = new Date(
                    localTime.getTime() - offset * 60000
                ).toISOString();
                return serverTime;
            };

        hashing.ts

            import bcrypt from "bcrypt";

            export const hashing = (password: string) => {
                return bcrypt.hashSync(password, 10);
            };

            export const checkPassword = (password: string, userPassword: string) => {
                return bcrypt.compareSync(password, userPassword);
            };

        jwt.ts

            import jwt from "jsonwebtoken";
            import CONFIG from "../config/environment";

            export const signJWT = (
                payload: object,
                options?: jwt.SignOptions | undefined
            ) => {
                return jwt.sign(payload, CONFIG.jwt_private, {
                    ...(options && options),
                    algorithm: "RS256",
                });
            };

            export const verifyJWT = (token: string) => {
                try {
                    const decoded = jwt.verify(token, CONFIG.jwt_public);
                    return {
                        valid: true,
                        expired: false,
                        decoded,
                    };
                } catch (error: any) {
                    return {
                        valid: false,
                        expired: error.message === "jwt is expired or not eligible to use",
                        decoded: null,
                    };
                }
            };

        dezerialized.ts di folder middleware

            import { Request, Response, NextFunction } from "express";
            import { verifyJWT } from "../utils/jwt";

            const deserializeToken = async (
                req: Request,
                res: Response,
                next: NextFunction
            ) => {
            const accessToken = req.headers.authorization?.replace(/^Bearer\s/, "");

            if (!accessToken) {
                return next();
            }

            const token: any = verifyJWT(accessToken);

            if (token.decoded) {
                res.locals.user = token.decoded;
                return next();
            }

                if (token.expired) {
                    return next();
                }

                return next();
            };

            export default deserializeToken;

        index.ts di folder routes

            import { Application, Router } from "express";
            // import {ExampleRouter} from "./example.route";

            const _routes: Array<[string, Router]> = [
                // ["/example", ExampleRouter],
            ];

            export const routes = (app: Application) => {
                _routes.forEach((route) => {
                    const [url, router] = route;
                    app.use(url, router);
                });
            };

        logger.ts

            import pino from "pino";
            import pretty from "pino-pretty";
            import moment from "moment";

            export const logger = pino(
            {
                base: {
                pid: false,
                },
                timestamp: () => `,"time":"${moment().format("DD-MM-YYY HH:mm:ss.Z")}"`,
            },
            pretty()
            );

        prismaClient.ts

            import { PrismaClient } from "@prisma/client";

            export const prisma = new PrismaClient();

        server.ts

            import express, { Application } from "express";
            import bodyParser from "body-parser";
            import cors from "cors";
            import deserializeToken from "../middleware/dezerializedToken";
            import { routes } from "../routes";
            import dotenv from "dotenv";

            const createServer = () => {
                // connect DB
                dotenv.config();
                const app: Application = express();

                app.use(deserializeToken);

                // parse body request
                app.use(bodyParser.urlencoded({ extended: false }));
                app.use(bodyParser.json());

                // cors
                app.use(cors());
                app.use((req, res, next) => {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Access-Control-Allow-Methods", "*");
                    res.setHeader("Access-Control-Allow-Headers", "*");
                    next();
                });

                routes(app);

                return app;
            };

            export default createServer;

        swagger.ts

            import { Application, Request, Response } from "express";
            import swaggerJsdoc from "swagger-jsdoc";
            import swaggerUi from "swagger-ui-express";
            import { version } from "../../package.json";
            import { logger } from "./logger";

            const options: swaggerJsdoc.Options = {
                definition: {
                    openapi: "3.0.0",
                    info: {
                        title: "REST API Siaga SIMRS Docs",
                        version,
                    },
                    components: {
                        securitySchemes: {
                            bearerAuth: {
                                type: "http",
                                scheme: "bearer",
                                bearerFormat: "JWT",
                            },
                        },
                    },

                    // To make sure Authorization is always on top
                    tags: [
                        {
                            name: "Authorization",
                        },
                    ],
                },
                apis: ["./src/routes/**/*.ts"],
            };

            const swaggerSpec = swaggerJsdoc(options);

            function swaggerDocs(app: Application, port: number | string) {
                // Swagger page
                app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

                // Docs in JSON format
                app.get("/docs.json", (req: Request, res: Response) => {
                    res.setHeader("Content-Type", "application/json");
                    res.send(swaggerSpec);
                });

                logger.info(`Docs available at http://localhost:${port}/docs`);
            }

            export default swaggerDocs;

    42. Setup awal selesai, bisa dilanjut membuat auth, type, validation, service, controller, route
