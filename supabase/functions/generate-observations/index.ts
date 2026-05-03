import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ObservationsRequest {
  symptoms: string;
  diagnosticResults?: string;
  clientDescription?: string;
}

interface ObservationsResponse {
  technicalObservations: string;
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
      symptoms,
      diagnosticResults,
      clientDescription,
    }: ObservationsRequest = await req.json();

    if (!symptoms || symptoms.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "symptoms field is required" }),
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

    const systemPrompt = `You are an expert automotive technician writing professional technical observations for work orders.

Your observations should be:
1. Clear and concise
2. Professional and technical
3. Specific about what was found
4. Include actionable recommendations
5. Written for internal technical team review

Format as a single professional paragraph suitable for a work order technical notes section.`;

    let userMessage = `Write technical observations for this vehicle issue:\n\nSymptoms: "${symptoms}"`;

    if (diagnosticResults) {
      userMessage += `\n\nDiagnostic Results: ${diagnosticResults}`;
    }
    if (clientDescription) {
      userMessage += `\n\nClient Description: ${clientDescription}`;
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
        max_tokens: 512,
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
        JSON.stringify({ error: "Failed to generate observations" }),
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

    const response_data: ObservationsResponse = {
      technicalObservations: content.text,
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
