require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const { Cashfree } = require("cashfree-pg");

const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const paymentRouter = require("./routes/Payment");

//middlewares

const corsOptions = {
  origin: ["https://buzz-basket-taupe.vercel.app/", "http://localhost:5173"], // Add frontend origins
  credentials: true, // Allow cookies and credentials
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  exposedHeaders: ["X-Total-Count"], // Expose custom headers like X-Total-Count
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "build")));



// to parse req.body
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter.router);
app.use("/brands", brandsRouter.router);
app.use("/users", usersRouter.router);
app.use("/auth", authRouter.router);
app.use("/cart", cartRouter.router);
app.use("/orders", ordersRouter.router);
app.use("/payment", paymentRouter.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("database connected");
}

app.get("/", (req, res) => {
  res.json({ status: "success" });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
