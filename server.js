const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Elite Backend Running 🚀");
});

// ================= APPLY =================
app.post("/apply", (req, res) => {
  const data = req.body;
  console.log("📄 Application Received:", data);

  res.json({
    success: true,
    message: "Application saved successfully"
  });
});

// ================= PAY =================
app.post("/pay", async (req, res) => {
  let { phone, amount } = req.body;

  // ================= FIX PHONE =================
  let cleanPhone = String(phone).trim();

  if (cleanPhone.startsWith("0")) {
    cleanPhone = "+254" + cleanPhone.slice(1);
  } else if (cleanPhone.startsWith("254")) {
    cleanPhone = "+" + cleanPhone;
  } else if (!cleanPhone.startsWith("+254")) {
    return res.status(400).json({
      success: false,
      error: "Invalid phone format"
    });
  }

  // ================= FIX AMOUNT =================
  const cleanAmount = Number(amount);

  if (!cleanAmount || cleanAmount < 1) {
    return res.status(400).json({
      success: false,
      error: "Invalid amount"
    });
  }

  console.log("📲 PAYMENT REQUEST:", cleanPhone, cleanAmount);

  // ================= AUTH =================
  const auth = Buffer.from(
    process.env.PAYHERO_USERNAME + ":" + process.env.PAYHERO_PASSWORD
  ).toString("base64");

  try {
    const response = await fetch(
      "https://backend.payhero.co.ke/api/v2/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          channel_id: process.env.PAYHERO_CHANNEL_ID,
          provider: "m-pesa",
          phone_number: cleanPhone,
          amount: cleanAmount,
          account_reference: "Elite Global Careers",
          transaction_desc: "Application Fee",
          callback_url: "https://jobs-abroad-r8k0.onrender.com/callback"
        })
      }
    );

    // ================= HANDLE ERROR =================
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ PAYHERO ERROR:", text);

      return res.status(500).json({
        success: false,
        error: text
      });
    }

    const data = await response.json();

    console.log("💰 PAYHERO RESPONSE:", data);

    // ================= SUCCESS =================
    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("❌ SERVER ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================= CALLBACK =================
app.post("/callback", (req, res) => {
  console.log("📥 CALLBACK RECEIVED:", req.body);

  if (req.body.status === "SUCCESS") {
    console.log("✅ Payment Successful");
  } else {
    console.log("❌ Payment Failed");
  }

  res.sendStatus(200);
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
