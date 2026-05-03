import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DiagnosticsRequest {
  symptoms: string;
  vehicleInfo?: {
    brand?: string;
    model?: string;
    year?: number;
  };
}

interface DiagnosticsResponse {
  possibleCauses: Array<{
    cause: string;
    likelihood: "high" | "medium" | "low";
    diagnosticSteps: string[];
  }>;
  recommendedTests: string[];
  disclaimer: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { symptoms, vehicleInfo }: DiagnosticsRequest = await req.json();

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

    const systemPrompt = `You are an experienced automotive diagnostic specialist.
Your role is to suggest possible causes for vehicle symptoms and recommend diagnostic procedures.

IMPORTANT: You must always include a strong disclaimer that this is preliminary support only and not a definitive diagnosis.
A certified technician must perform the actual diagnosis.

Provide structured suggestions for:
1. possibleCauses: Array of potential issues with likelihood and diagnostic steps
2. recommendedTests: Specific tests or inspections to confirm the diagnosis
3. disclaimer: Clear statement that this is support, not a diagnosis

Be professional and thorough. Include safety considerations.`;

    const vehicleContext = vehicleInfo
      ? `Vehicle: ${vehicleInfo.brand || ""} ${vehicleInfo.model || ""} (${vehicleInfo.year || ""})`
      : "";

    const userMessage = `${vehicleContext}

Vehicle symptoms reported: "${symptoms}"

Please suggest possible causes and diagnostic procedures. Remember to include a disclaimer.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
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
        JSON.stringify({ error: "Failed to generate diagnostics" }),
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

    let jsonResponse: DiagnosticsResponse;
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      jsonResponse = JSON.parse(jsonMatch[0]);
    } catch (_e) {
      jsonResponse = {
        possibleCauses: [
          {
            cause: "Professional inspection required",
            likelihood: "high",
            diagnosticSteps: ["Have a certified technician inspect the vehicle"],
          },
        ],
        recommendedTests: ["Full diagnostic scan"],
        disclaimer:
          "This is preliminary support based on symptoms. A certified technician must perform the actual diagnosis.",
      };
    }

    return new Response(JSON.stringify(jsonResponse), {
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
