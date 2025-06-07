import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { filter ,filter2} from "./filter.js";

// Load environment variables from .env file
dotenv.config();


const ai = new GoogleGenAI({ apiKey: process.env.gemini_api });

async function run(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return filter2(filter(response.text));
}

export default run;
