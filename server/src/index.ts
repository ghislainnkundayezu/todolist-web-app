import express, { Express, Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import protectedRouter from "./routes/protectedRoutes";
import cookieParser from "cookie-parser";
import authMiddleware from "./middleware/Authentication/authMiddleware";
import dotenv  from "dotenv";
import path from "path";
import DatabaseConnection from "./db";



dotenv.config();     // configure the dotenv file to use environment variables


const app: Express = express();             

const PORT = Number(process.env.PORT) || 3000;

app.use(cookieParser());          // middleware that allows our code to intercept cookies sent in requests.



app.use(express.json());          // middleware that allows our code to intercept JSON Data sent in requests.

// serve the build files from the react app.
app.use(express.static(path.join(__dirname, '../../client/dist')));


app.use("/api/v1/auth", authRouter);      // middleware to route all requests related to authentication the authRouter.
app.use("/api/v1/protected", authMiddleware, protectedRouter);    // middleware to route all requests related to protected resources to the protectedRputer.



// serve the index.html file to handle client side routing.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log("I am listening at PORT ", PORT);
  const { address, port } = server.address() as { address: string, port: number };
  console.log(`Server running on ${address}:${port}`);
});

// Start the connection to the database.
DatabaseConnection();





