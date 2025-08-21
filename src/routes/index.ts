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
