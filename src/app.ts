import express, { Application, NextFunction, Request, Response } from "express";

import cors from "cors";
import router from "./app/routes";
import status from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "Api Not Found",
    error: {
      path: req.originalUrl,
      message: "your requested path is not found",
    },
  });
  next();
});
export default app;
