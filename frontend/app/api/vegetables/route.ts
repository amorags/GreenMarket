import { NextResponse } from "next/server"

// Vegetables microservice data
const vegetablesData = [
  { id: 9, name: "Carrot", category: "Vegetables", color: "Orange", calories: 41, inSeason: true },
  { id: 10, name: "Broccoli", category: "Vegetables", color: "Green", calories: 34, inSeason: true },
  { id: 11, name: "Spinach", category: "Vegetables", color: "Green", calories: 23, inSeason: true },
  { id: 12, name: "Bell Pepper", category: "Vegetables", color: "Red/Green/Yellow", calories: 31, inSeason: false },
]

export async function GET() {
  // Simulate occasional service failures (15% chance)
  if (Math.random() < 0.15) {
    return new NextResponse(null, {
      status: 503,
      statusText: "Service Unavailable",
    })
  }

  // Add artificial delay to simulate network latency (200-700ms)
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 500))

  return NextResponse.json(vegetablesData)
}
