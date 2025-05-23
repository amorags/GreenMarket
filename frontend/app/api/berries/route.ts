import { NextResponse } from "next/server"

// Berries microservice data
const berriesData = [
  { id: 1, name: "Strawberry", category: "Berries", color: "Red", calories: 32, inSeason: true },
  { id: 2, name: "Blueberry", category: "Berries", color: "Blue", calories: 57, inSeason: true },
  { id: 3, name: "Raspberry", category: "Berries", color: "Red", calories: 52, inSeason: false },
  { id: 4, name: "Blackberry", category: "Berries", color: "Black", calories: 43, inSeason: true },
]

export async function GET() {
  // Simulate occasional service failures (20% chance)
  if (Math.random() < 0.2) {
    return new NextResponse(null, {
      status: 503,
      statusText: "Service Unavailable",
    })
  }

  // Add artificial delay to simulate network latency (200-800ms)
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 600))

  return NextResponse.json(berriesData)
}
