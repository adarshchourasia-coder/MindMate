import express from "express";

const crisisKeywords = [
  "suicide",
  "self-harm",
  "i want to die",
  "kill myself",
  "help me",
  "depressed",
  "hopeless",
  "no way out",
  "end my life",
  "cant go on",
  "worthless"
];

// Hotline number and info (US default)
const hotlineInfo = {
  phone: "1-800-273-8255",
  name: "National Suicide Prevention Lifeline",
  url: "https://suicidepreventionlifeline.org/"
};

function crisisDetection(req, res, next) {
  if (req.method !== "POST") return next();

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return next();
    }

    const lowerMsg = message.toLowerCase();

    // Check for any crisis keyword presence
    const crisisFound = crisisKeywords.some((keyword) =>
      lowerMsg.includes(keyword)
    );

    if (crisisFound) {
      req.crisis = true;
      req.hotline = hotlineInfo;
      console.warn(
        `[CRISIS DETECTED] Message: "${message}". User IP: ${req.ip} Time: ${new Date().toISOString()}`
      );
    } else {
      req.crisis = false;
    }
  } catch (error) {
    // In case of error, do not block request, just proceed without crisis flag
    req.crisis = false;
    console.error("Error in crisisDetection middleware:", error);
  }
  next();
}

export default crisisDetection;
