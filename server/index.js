
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to TripGenie AI Backend!");
});

// Health check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TripGenie AI server is running!",
    status: "Healthy"
  });
});

// POST API: Generate AI travel itinerary
app.post("/api/trips", async (req, res) => {
  try {
    // Check whether API key exists
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing. Check your .env file."
      });
    }

    // Get data from frontend
    const { destination, duration, travelers, budget } = req.body;

    // Validate destination
    if (
      typeof destination !== "string" ||
      !destination.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Destination is required."
      });
    }

    // Validate duration
    if (
      !Number.isInteger(Number(duration)) ||
      Number(duration) < 1 ||
      Number(duration) > 30
    ) {
      return res.status(400).json({
        success: false,
        message: "Duration must be between 1 and 30 days."
      });
    }

    // Validate travellers
    if (
      !Number.isInteger(Number(travelers)) ||
      Number(travelers) < 1 ||
      Number(travelers) > 6
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select between 1 and 6 travellers."
      });
    }

    // Validate budget
    if (!["Budget", "Standard", "Luxury"].includes(budget)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid budget."
      });
    }

    // Prepare trip details
    const trip = {
      destination: destination.trim(),
      duration: Number(duration),
      travelers: Number(travelers),
      budget
    };

    console.log("Generating itinerary for:", trip);

    // Import Gemini SDK
    const { GoogleGenAI } = await import("@google/genai");

    // Initialize Gemini
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    // Create AI prompt
    const prompt = `
      You are TripGenie AI, an expert travel planner.

      Create a personalized travel itinerary using these details:

      Destination: ${trip.destination}
      Duration: ${trip.duration} days
      Travellers: ${trip.travelers}
      Budget: ${trip.budget}

      Return a practical and detailed itinerary.

      Include:
      1. Trip title
      2. Short trip overview
      3. Day-wise itinerary
      4. Activities and places to visit each day
      5. Suggested food experiences
      6. Estimated budget in Indian Rupees (INR)
      7. Important travel tips

      Consider the number of travellers and selected budget.

      Do not claim that prices, opening hours or availability
      are live-verified. Clearly label costs as estimates.

      Return ONLY valid JSON in this structure:

      {
        "title": "Trip title",
        "overview": "Trip overview",
        "dailyItinerary": [
          {
            "day": 1,
            "title": "Day title",
            "activities": [
              {
                "time": "Morning",
                "place": "Place name",
                "description": "Activity description"
              }
            ]
          }
        ],
        "estimatedBudget": {
          "total": "Estimated total in INR",
          "perPerson": "Estimated per-person cost"
        },
        "travelTips": [
          "Travel tip 1",
          "Travel tip 2"
        ]
      }
    `;

    // Generate itinerary using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    // Convert Gemini response into JavaScript object
    const itinerary = JSON.parse(response.text);

    console.log("AI itinerary generated successfully!");

    // Send itinerary to frontend
    res.status(200).json({
      success: true,
      message: "AI itinerary generated successfully!",
      trip,
      itinerary
    });

  } catch (error) {
    console.error("Gemini API Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate itinerary. Please try again."
    });
  }
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`TripGenie AI server running on port ${PORT}`);
});
