const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Elite Backend Running 🚀");
});

app.post("/apply", (req, res) => {
  const data = req.body;
  console.log("Application Received:", data);

  res.json({
    success: true,
    message: "Application saved successfully"
  });
});

app.post("/pay", (req, res) => {
  const { phone, amount } = req.body;
  console.log("Payment Request:", phone, amount);

  res.json({
    success: true,
    message: "Payment initiated (mock)"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});