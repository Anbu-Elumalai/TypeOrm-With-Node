// import "reflect-metadata";
// import express from "express";
// import { useExpressServer } from "routing-controllers";
// import { AppDataSource } from "./data-source";
// import fileUpload from 'express-fileupload';

// AppDataSource.initialize()
//   .then(() => {
//     console.log("✅ Database connected");
//     const app = express();
//     // Add body parsing middleware with limits to prevent form errors
//     app.use(express.json({ limit: '10mb' }));
//     app.use(express.urlencoded({ extended: true, limit: '10mb' }));
//     app.use(fileUpload({
//       limits: { fileSize: 1000 * 1024 * 1024 }, // 10 MB
//       abortOnLimit: true,
//       useTempFiles: false,
//     }));

//     // Body parsers
//     app.use(express.json({ limit: '1000mb' }));
//     app.use(express.urlencoded({ limit: '1000mb', extended: false }));
//     useExpressServer(app, {
//       controllers: [__dirname + "/controllers/**/*.ts"],
//       middlewares: [__dirname + "/middlewares/**/*.ts"],
//       defaultErrorHandler: false,
//       validation: true,
//       classTransformer: true,
//     });
//     console.log("MONGO_URI:", process.env.MONGO_URI);
//     app.get('/test', () => {
//       console.log("🚀 Server running successfully");
//     })
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => console.log("❌ DB Error:", error));

import "reflect-metadata";
import express from "express";
import { useExpressServer } from "routing-controllers";
import { AppDataSource } from "./data-source";
import fileUpload from "express-fileupload";

let app: any;
let initialized = false;

async function createApp() {
  if (initialized) return app;

  // DB init (lazy – serverless safe)
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("✅ Database connected");
  }

  app = express();

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use(
    fileUpload({
      limits: { fileSize: 10 * 1024 * 1024 }, // ⚠️ reduce for serverless
      abortOnLimit: true,
      useTempFiles: false,
    })
  );

  useExpressServer(app, {
    controllers: [__dirname + "/controllers/**/*.{ts,js}"],
    middlewares: [__dirname + "/middlewares/**/*.{ts,js}"],
    defaultErrorHandler: false,
    validation: true,
    classTransformer: true,
  });

  initialized = true;
  return app;
}

// ✅ THIS is what Vercel needs
export default async function handler(req: any, res: any) {
  const app = await createApp();
  return app(req, res);
}
