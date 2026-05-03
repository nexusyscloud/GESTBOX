import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QuotationRequest {
  services: Array<{
    description: string;
    estimatedHours: number;
  }>;
  laborRatePerHour?: number;
  suggestedParts?: Array<{
    name: string;
    quantity: number;
    estimatedCost: number;
  }>;
}

interface QuotationItem {
  description: string;
  hours: number;
  laborRate: number;
  laborCost: number;
  partsCost: number;
  total: number;
}

interface QuotationResponse {
  items: QuotationItem[];
  subtotal: number;
  laborTotal: number;
  partsTotal: number;
  tax: number;
  total: number;
  notes: string;
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
      services,
      laborRatePerHour = 85,
      suggestedParts = [],
    }: QuotationRequest = await req.json();

    if (!services || !Array.isArray(services) || services.length === 0) {
      return new Response(
        JSON.stringify({ error: "services array is required and must not be empty" }),
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

    const servicesText = services
      .map((s) => `- ${s.description}: ${s.estimatedHours} hours`)
      .join("\n");

    const partsText =
      suggestedParts.length > 0
        ? "\n\nSuggested Parts:\n" +
          suggestedParts
            .map((p) => `- ${p.name} (Qty: ${p.quantity}): $${p.estimatedCost}`)
            .join("\n")
        : "";

    const systemPrompt = `You are an automotive service advisor creating professional quotations.
Your task is to generate realistic pricing for automotive services and parts.

Provide a JSON response with:
1. items: Array of service items with hours, labor rate, labor cost, parts cost, and total
2. subtotal: Sum of all items
3. laborTotal: Total labor costs
4. partsTotal: Total parts costs
5. tax: Tax amount (assume 10% tax rate)
6. total: Grand total
7. notes: Any relevant notes about the quotation

Be realistic with pricing. Labor costs = hours × labor rate.
Parts costs are as suggested or estimated based on industry standards.`;

    const userMessage = `Create a quotation for the following automotive services:

Services:
${servicesText}${partsText}

Labor rate: $${laborRatePerHour} per hour
Tax rate: 10%

Generate a detailed, professional quotation.`;

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
        JSON.stringify({ error: "Failed to generate quotation" }),
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

    let jsonResponse: QuotationResponse;
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      jsonResponse = JSON.parse(jsonMatch[0]);
    } catch (_e) {
      const laborTotal = services.reduce((sum, s) => sum + s.estimatedHours * laborRatePerHour, 0);
      const partsTotal = suggestedParts.reduce((sum, p) => sum + p.estimatedCost * p.quantity, 0);
      const subtotal = laborTotal + partsTotal;
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      jsonResponse = {
        items: services.map((s) => ({
          description: s.description,
          hours: s.estimatedHours,
          laborRate: laborRatePerHour,
          laborCost: s.estimatedHours * laborRatePerHour,
          partsCost: 0,
          total: s.estimatedHours * laborRatePerHour,
        })),
        subtotal,
        laborTotal,
        partsTotal,
        tax,
        total,
        notes: "Prices are estimates and subject to change based on actual conditions.",
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
