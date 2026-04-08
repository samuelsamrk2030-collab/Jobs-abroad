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

app.post("/pay", async (req, res) => {
  const { phone, amount } = req.body;

  const auth = Buffer.from(
  process.env.PAYHERO_USERNAME + ":" + process.env.PAYHERO_PASSWORD
).toString("base64");

  try {
    const response = await fetch("https://backend.payhero.co.ke/api/v2/payments", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        channel_id: process.env.PAYHERO_CHANNEL_ID,
        phone_number: phone,
        amount: amount,
        account_reference: "Elite Global Careers",
        transaction_desc: "Job Application Payment",
        callback_url: "https://jobs-abroad-r8k0.onrender.com/callback"
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment failed" });
  }
});

app.post("/callback", (req, res) => {
  console.log("PAYMENT CALLBACK:", req.body);

  if (req.body.status === "SUCCESS") {
    console.log("✅ Payment Successful");
  } else {
    console.log("❌ Payment Failed");
  }

  res.sendStatus(200);
});
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
