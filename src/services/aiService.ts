export const getAIResponse = async (message: string) => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    console.log("API KEY:", apiKey);
    console.log("Message sent:", message);

    if (!apiKey) {
      return "Error: API key not found";
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-specdec",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);

    const data = await res.json();

    console.log("Full API Response:", JSON.stringify(data, null, 2));

    if (!res.ok) {
      console.error("API Error Response:", data);
      return `Error: ${data.error?.message || JSON.stringify(data) || "API request failed"}`;
    }

    if (!data) {
      console.error("No data in response");
      return "Error: No data received";
    }

    if (!data.choices) {
      console.error("No choices in response:", data);
      return `Error: No choices - ${JSON.stringify(data)}`;
    }

    if (data.choices.length === 0) {
      console.error("Choices array is empty");
      return "Error: Empty choices array";
    }

    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error("No content in first choice:", data.choices[0]);
      return `Error: No content - ${JSON.stringify(data.choices[0])}`;
    }

    console.log("AI Response content:", content);
    return content;
  } catch (err) {
    console.error("Catch block error:", err);
    return `Error: ${err instanceof Error ? err.message : "Failed to fetch"}`;
  }
};
