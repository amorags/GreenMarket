import { NextResponse } from "next/server"

// Nuts microservice data
const nutsData = [
  { id: 13, name: "Almond", category: "Nuts", color: "Brown", calories: 579, inSeason: true },
  { id: 14, name: "Walnut", category: "Nuts", color: "Brown", calories: 654, inSeason: true },
  { id: 15, name: "Cashew", category: "Nuts", color: "Beige", calories: 553, inSeason: true },
  { id: 16, name: "Pistachio", category: "Nuts", color: "Green", calories: 562, inSeason: false },
]

export async function GET() {
  // Simulate occasional service failures (30% chance - most unreliable service)
  if (Math.random() < 0.3) {
    return new NextResponse(null, {
      status: 503,
      statusText: "Service Unavailable",
    })
  }

  // Add artificial delay to simulate network latency (300-1000ms)
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700))

  return NextResponse.json(nutsData)
}
