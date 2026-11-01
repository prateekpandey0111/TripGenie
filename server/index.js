
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Trip = require("./models/Trip");
const dns = require("dns");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const authMiddleware = require("./middleware/authMiddleware");

// Use public DNS servers for MongoDB connection
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Create Express application
const app = express();

// Middleware
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://trip-genie-six.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


// Authentication cookie settings
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

// REGISTER API
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a name, valid email and password of at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Create JWT
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Store token in HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
});

// LOGIN API
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare entered password with stored hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
});

// LOGOUT API
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
});
// GET API: Check currently logged-in user
app.get("/api/auth/me", authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

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
app.post("/api/trips", authMiddleware, async (req, res) => {
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
    // Save generated trip in MongoDB
const savedTrip = await Trip.create({
  userId: req.user._id,
  destination: trip.destination,
  duration: trip.duration,
  travelers: trip.travelers,
  budget: trip.budget,
  itinerary,
});

console.log("Trip saved successfully:", savedTrip._id);

    console.log("AI itinerary generated successfully!");

    // Send itinerary to frontend
   return res.status(200).json({
  success: true,
  message: "AI itinerary generated and saved successfully!",
  trip: savedTrip,
  itinerary,
});

  } catch (error) {
    console.error("Gemini API Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to generate itinerary. Please try again."
    });
  }
});


// GET API: Fetch trips belonging to logged-in user
app.get("/api/trips", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (error) {
    console.error("Fetch Trips Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch trips.",
    });
  }
});




// DELETE API: Delete only the logged-in user's trip
app.delete("/api/trips/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID.",
      });
    }

    const deletedTrip = await Trip.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deletedTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully!",
    });
  } catch (error) {
    console.error("Delete Trip Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete trip.",
    });
  }
});


// PUT API: Update saved trip and regenerate AI itinerary
app.put("/api/trips/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { destination, duration, travelers, budget } = req.body;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID.",
      });
    }

    // Check Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing.",
      });
    }

    // Validate updated trip details
    if (
      typeof destination !== "string" ||
      !destination.trim() ||
      !Number.isInteger(Number(duration)) ||
      Number(duration) < 1 ||
      Number(duration) > 30 ||
      !Number.isInteger(Number(travelers)) ||
      Number(travelers) < 1 ||
      Number(travelers) > 6 ||
      !["Budget", "Standard", "Luxury"].includes(budget)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid trip details.",
      });
    }

    // Find trip belonging to the logged-in user
    const existingTrip = await Trip.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!existingTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    // Prepare updated details
    const updatedDetails = {
      destination: destination.trim(),
      duration: Number(duration),
      travelers: Number(travelers),
      budget,
    };

    // Initialize Gemini SDK
    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Create updated itinerary prompt
    const prompt = `
      You are TripGenie AI, an expert travel planner.

      Create a completely new personalized travel itinerary
      using these updated details:

      Destination: ${updatedDetails.destination}
      Duration: ${updatedDetails.duration} days
      Travellers: ${updatedDetails.travelers}
      Budget: ${updatedDetails.budget}

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

    // Generate new itinerary using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    // Parse AI response
    const updatedItinerary = JSON.parse(response.text);

    // Update only the logged-in user's trip
    const updatedTrip = await Trip.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      {
        ...updatedDetails,
        itinerary: updatedItinerary,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Trip and itinerary updated successfully!",
      trip: updatedTrip,
      itinerary: updatedItinerary,
    });

  } catch (error) {
    console.error("Update Trip Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update trip. Please try again.",
    });
  }
});



// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`TripGenie AI server running on port ${PORT}`);
});
