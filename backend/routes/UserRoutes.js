import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password,faceDescriptor } = req.body;
    
    // Ensure at least one authentication method is provided
    //  faceDescriptor = Object.values(faceDescriptor);

console.log(faceDescriptor);
    // console.log(email ,faceDescriptor);
    if (!email && !faceDescriptor) {
      return res.status(400).json({
        error: "Either email/password or face data is required to register.",
      });
    }

    // Check if the user already exists (by email if provided)
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email." });
      }
    }

    // Create the user
    
    
      const  newUser = await User.create({
        name,
        email,
        password, 
        faceDescriptor,
      });
      if (newUser) {
        res.status(201).json({
          message: "User registered successfully",
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email||null,
          },
        });
      } else {
        res.status(400).json({ error: "User registration failed." });
      }
    
   

    
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password, faceDescriptor } = req.body;

    console.log("🔹 Received request:", req.body);

    // Case 1: Login using email & password
    if (email && password) {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "User not found with this email." });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials." });
      }

      return res.status(200).json({
        message: "✅ Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    // Case 2: Login using Face Recognition
    else if (faceDescriptor) {
      console.log("📸 Face descriptor received:", faceDescriptor);

      if (!Array.isArray(faceDescriptor) || faceDescriptor.length === 0) {
        return res.status(400).json({ error: "Invalid face descriptor format." });
      }

      const users = await User.find({ faceDescriptor: { $exists: true } });
      // if (!users || users.length === 0) {
      //   return res.status(400).json({ error: "No users found for face recognition." });
      // }

      let closestUser = null;
      let minDistance = Infinity;
      const THRESHOLD = 0.5; // Adjust based on testing

      users.forEach((user) => {
        if (Array.isArray(user.faceDescriptor)) {
          const distance = euclideanDistance(user.faceDescriptor, faceDescriptor);
          if (distance < minDistance) {
            minDistance = distance;
            closestUser = user;
          }
        }
      });

      if (minDistance > THRESHOLD) {
        return res.status(400).json({ error: "No matching face found." });
      }

      return res.status(200).json({
        message: "✅ Login successful with face recognition",
        user: {
          id: closestUser._id,
          name: closestUser.name,
          email: closestUser.email || null,
        },
      });
    }

    // Case 3: Missing credentials
    else {
      return res.status(400).json({ error: "Please provide email/password or faceDescriptor." });
    }
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

// Function to compute Euclidean distance
function euclideanDistance(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    console.error("⚠️ Face descriptor length mismatch");
    return Infinity;
  }
  return Math.sqrt(arr1.reduce((sum, val, i) => sum + Math.pow(val - arr2[i], 2), 0));
}



export default router;
