import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  try {
    const response = await fetch("https://www.rokhub.xyz/api/events", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ROK-Events/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching events:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: JSON.stringify({
        error: "Failed to fetch events",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
