import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CustomerExplanationRequest {
  technicalObservations: string;
  maintenanceType?: string;
  clientLanguageLevel?: "simple" | "technical";
}

interface CustomerExplanationResponse {
  explanation: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      technicalObservations,
      maintenanceType,
      clientLanguageLevel = "simple",
    }: CustomerExplanationRequest = await req.json();

    if (!technicalObservations || technicalObservations.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: "technicalObservations field is required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const languageLevel =
      clientLanguageLevel === "technical"
        ? "Use appropriate automotive terminology but still keep it understandable."
        : "Use simple, everyday language that a non-technical car owner can understand. Avoid jargon.";

    const systemPrompt = `You are a customer service specialist for an automotive workshop.
Your task is to translate technical observations into clear, friendly explanations for vehicle owners.

Guidelines:
1. ${languageLevel}
2. Be professional but friendly
3. Explain what was found and why it matters
4. Suggest what should be done about it
5. Estimate timeframe if appropriate
6. Keep it concise (3-4 sentences maximum)

Write as if you're explaining to a customer over the phone.`;

    let userMessage = `Convert this technical observation into a customer-friendly explanation:\n\n"${technicalObservations}"`;

    if (maintenanceType) {
      userMessage += `\n\nType of work: ${maintenanceType}`;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 256,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to generate explanation" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data.content[0];

    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const response_data: CustomerExplanationResponse = {
      explanation: content.text,
    };

    return new Response(JSON.stringify(response_data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
