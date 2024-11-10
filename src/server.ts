import 'dotenv/config';
import { CONFIG } from "./config";
import createApp from "./controller/app";
import { createPgClient } from "./db";

const PORT = CONFIG.port;

const dbClient = createPgClient({ connectionString: CONFIG.dbConnectionString });

const options = {
  logger: {
    level: 'debug',
    transport: { target: 'pino-pretty' }
  },
};

const app = createApp(options, { dbClient });

app.listen({ port: PORT }, (error, address) => {
  if (error) {
    app.log.error(error);
    process.exit(1);
  }
  app.log.info(`Server is started successfully.`)
});