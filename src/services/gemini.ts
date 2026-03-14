import { ReceiptAnalysis } from "../types";

export async function analyzeReceipt(base64Image: string, mimeType: string): Promise<ReceiptAnalysis> {
  const response = await fetch("/api/accountant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ base64Image, mimeType }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze receipt");
  }

  const result = await response.json();
  
  return {
    ...result,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
}
