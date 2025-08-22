import { logger } from "./utils/logger";
import createServer from "./utils/server";
import swaggerDocs from "./utils/swagger";

const app = createServer();
const port: string | number = process.env.PORT || 8000;

app.listen(port, () => {
  logger.info(`Server is listeing on port ${port}`);

  swaggerDocs(app, port);
});
