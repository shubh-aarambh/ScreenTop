import { toast } from "sonner";

// Define multiple API endpoints to try in order
const API_ENDPOINTS = [
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
];

export interface GeminiResponse {
  success: boolean;
  data?: {
    genres?: string[];
    era?: string;
    mood?: string;
    keywords?: string[];
    searchQuery: string;
  };
  error?: string;
}

export const analyzeMoviePrompt = async (prompt: string, apiKey: string): Promise<GeminiResponse> => {
  if (!apiKey) {
    return { 
      success: false,
      error: "Missing API key" 
    };
  }

  if (!prompt || prompt.trim() === "") {
    return {
      success: false,
      error: "Please enter a movie description"
    };
  }

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Analyze this movie request: "${prompt}"
            Output a structured JSON with these fields only:
            1. genres: An array of likely genres
            2. era: Time period if mentioned (e.g. "90s", "modern", "80s sci-fi")
            3. mood: The emotional tone (e.g. "funny", "thrilling", "romantic")
            4. keywords: Important descriptive words for search
            5. searchQuery: A refined search query for IMDB
            
            Only return valid JSON with these fields - no extra text.`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1000
    }
  };

  // Try each API endpoint in sequence
  let lastError = null;

  for (const apiUrl of API_ENDPOINTS) {
    try {
      console.log(`Trying Gemini API endpoint: ${apiUrl}`);
      
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Gemini API error with ${apiUrl}:`, errorData);
        lastError = new Error(errorData.error?.message || `API error: ${response.status}`);
        continue; // Try the next endpoint
      }

      const data = await response.json();
      
      // Check if the expected data structure exists
      if (!data.candidates || !data.candidates[0]?.content?.parts || !data.candidates[0].content.parts[0]?.text) {
        lastError = new Error("Unexpected API response format");
        continue; // Try the next endpoint
      }
      
      // Extract the generated text
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Find the JSON portion in the response
      const jsonMatch = generatedText.match(/(\{[\s\S]*\})/);
      
      if (jsonMatch) {
        try {
          // Parse the JSON
          const parsedData = JSON.parse(jsonMatch[0]);
          
          // Validate the required fields
          if (!parsedData.searchQuery) {
            lastError = new Error("Missing required 'searchQuery' field in response");
            continue; // Try the next endpoint
          }
          
          console.log(`Successfully used Gemini API endpoint: ${apiUrl}`);
          
          return {
            success: true,
            data: parsedData
          };
        } catch (jsonError) {
          lastError = new Error("Failed to parse JSON from response");
          continue; // Try the next endpoint
        }
      } else {
        lastError = new Error("Could not find valid JSON in response");
        continue; // Try the next endpoint
      }
    } catch (error) {
      console.error(`Error with Gemini API endpoint ${apiUrl}:`, error);
      lastError = error;
      // Continue with the next endpoint
    }
  }

  // If we reach here, all endpoints failed
  console.error("All Gemini API endpoints failed:", lastError);
  toast.error(lastError instanceof Error ? lastError.message : "Failed to analyze your request");
  return {
    success: false,
    error: lastError instanceof Error ? lastError.message : "Failed to connect to Gemini API"
  };
};
