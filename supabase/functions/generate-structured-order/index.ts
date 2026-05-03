import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StructuredOrderRequest {
  clientInput: string;
  vehicleInfo?: {
    brand?: string;
    model?: string;
    year?: number;
    mileage?: number;
  };
  clientId?: string;
  workOrderId?: string;
}

interface StructuredOrderResponse {
  maintenanceType: string;
  services: Array<{
    description: string;
    estimatedHours: number;
    priority: "high" | "medium" | "low";
  }>;
  diagnosticsNeeded: string[];
  estimatedDuration: string;
  additionalNotes: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { clientInput, vehicleInfo, clientId, workOrderId }: StructuredOrderRequest = await req.json();

    if (!clientInput || clientInput.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "clientInput is required" }),
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

    const systemPrompt = `You are an expert automotive service advisor for a large dealership or repair workshop.
Your task is to convert client descriptions of vehicle issues into structured work orders.

Analyze the client's description and provide a structured JSON response with:
1. maintenanceType: Classify as "Preventive", "Corrective", "Diagnostic", or "General"
2. services: Array of specific services needed with estimated hours and priority
3. diagnosticsNeeded: List of diagnostic checks recommended
4. estimatedDuration: Estimated total time (e.g., "2-3 hours")
5. additionalNotes: Any additional recommendations or considerations

Always be conservative with estimates. Mark critical safety items as "high" priority.
Never make definitive diagnoses - instead suggest diagnostic steps to confirm issues.`;

    const vehicleContext = vehicleInfo
      ? `\nVehicle Information: ${vehicleInfo.brand || ""} ${vehicleInfo.model || ""} (${vehicleInfo.year || ""}), ${vehicleInfo.mileage || "Unknown"} km`
      : "";

    const userMessage = `Client description of vehicle issue:\n\n"${clientInput}"${vehicleContext}

Please analyze this and provide a structured work order proposal.`;

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
        JSON.stringify({
          error: "Failed to generate structured order",
          details: error,
        }),
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

    let jsonResponse: StructuredOrderResponse;
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      jsonResponse = JSON.parse(jsonMatch[0]);
    } catch (_e) {
      jsonResponse = {
        maintenanceType: "Diagnostic",
        services: [
          {
            description: content.text,
            estimatedHours: 1,
            priority: "medium",
          },
        ],
        diagnosticsNeeded: ["Full vehicle inspection"],
        estimatedDuration: "1-2 hours",
        additionalNotes: "Please review the generated content for accuracy",
      };
    }

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
