const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const CustomError = require("./utils/customError");
const testRoutes = require("./routes/test");

dotenv.config();

const app = express();
const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// Middleware
app.use(express.json());
app.use(cors());

// Setup socket handlers
// setupSocket(io);

// Connect to MongoDB
connectDB();

// app.use((req, res, next) => {
//   console.log("Incoming request:", {
//     method: req.method,
//     url: req.url,
//     headers: req.headers,
//     body: req.body, // Note: This will not show file uploads
//     files: req.files, // This will show files if multer is used
//   });
//   next();
// });

// Routes
app.use("/api/test", testRoutes);

// Keep alive endpoint
app.get("/keep-alive", (req, res) => {
  res.status(200).send("Server is alive");
});

// app.all("*", (req, res, next) => {
//   const err = new CustomError(
//     404,
//     `Welcome To TonyStoryMockBackendSolutions. Can't find ${req.originalUrl} on the server`
//   );

//   next(err);
// });

// // Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("unhandledRejection", (err) => {
  console.log(err.name, ":", err.message);
  console.log("Unhandled Rejection Occurred! Shutting Down...");
  server.close(() => {
    process.exit(1);
  });
});
