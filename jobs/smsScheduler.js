// jobs/smsScheduler.js
import https from "https";
import cron from "node-cron";
import formModel from "../Models/Form/formModel.js"; // adjust path

const MSG91_AUTHKEY =
  process.env.MSG91_AUTHKEY || "340497ANvi5tSuSje85f4e5a5cP1";
const SMS_SENDER = process.env.SMS_SENDER || "UPFARM";
const MAX_ATTEMPTS = Number(process.env.SMS_MAX_ATTEMPTS || 5);
const MSG91_TEMPLATE_ID =
  process.env.MSG91_TEMPLATE_ID || "1707176406224415744";

// normalize phone
function normalizeIndianPhone(raw) {
  if (!raw) return null;
  let phone = String(raw).trim().replace(/\D/g, "");
  if (phone.length === 10) return `91${phone}`;
  return phone;
}

// send SMS using MSG91
function sendMsg(mobileNumber, name) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      sender: SMS_SENDER,
      route: "4",
      country: "91",
      sms: [
        {
          to: [mobileNumber],
          message: `Dear ${name}, welcome to Umapathy Farms. Thank you for joining us. Learn more at https://www.umapathyfarms.com. - Umapathy Farms`,
          template_id: MSG91_TEMPLATE_ID,
          variables_values: name,
        },
      ],
    });

    const options = {
      hostname: "api.msg91.com",
      port: 443,
      path: "/api/v2/sendsms",
      method: "POST",
      headers: {
        authkey: MSG91_AUTHKEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => (responseData += chunk));
      res.on("end", () => resolve(responseData));
    });

    req.on("error", (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

// run scheduler once
async function runOnce() {
  const now = new Date();
  const targetHour = 0;
  const targetMinute = 5;

  try {
    const forms = await formModel.find({
      smsSent: false,
      smsAttempts: { $lt: MAX_ATTEMPTS },
    });

    for (const form of forms) {
      const formDate = new Date(form.date);
      const isToday =
        formDate.getFullYear() === now.getFullYear() &&
        formDate.getMonth() === now.getMonth() &&
        formDate.getDate() === now.getDate();

      const isTargetTime =
        now.getHours() === targetHour && now.getMinutes() === targetMinute;

      if (isToday && isTargetTime) {
        const recipient = normalizeIndianPhone(form.phone);
        if (!recipient) continue;

        const name = form.name || "Customer";
        try {
          const res = await sendMsg(recipient, name);
          form.smsSent = true;
          form.smsSentAt = new Date();
          form.smsAttempts = (form.smsAttempts || 0) + 1;
          await form.save();
          console.log(
            `[SMS Scheduler] SMS sent for form ${form._id} -> ${recipient}`,
            res
          );
        } catch (err) {
          console.error(
            `[SMS Scheduler] Failed to send SMS for form ${form._id}:`,
            err
          );
          form.smsAttempts = (form.smsAttempts || 0) + 1;
          await form.save();
        }
      }
    }
  } catch (err) {
    console.error("[SMS Scheduler] Error fetching forms:", err);
  }
}

// start scheduler
export function startSmsScheduler() {
  console.log("[SMS Scheduler] Scheduler started, checking every minute...");
  runOnce(); // run immediately
  cron.schedule("* * * * *", runOnce); // run every minute
}
