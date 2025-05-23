import { NextResponse } from "next/server"

// Fruits microservice data
const fruitsData = [
  { id: 5, name: "Apple", category: "Fruits", color: "Red/Green", calories: 52, inSeason: true },
  { id: 6, name: "Banana", category: "Fruits", color: "Yellow", calories: 89, inSeason: true },
  { id: 7, name: "Orange", category: "Fruits", color: "Orange", calories: 47, inSeason: true },
  { id: 8, name: "Pineapple", category: "Fruits", color: "Yellow", calories: 50, inSeason: false },
]

export async function GET() {
  // Simulate occasional service failures (10% chance)
  if (Math.random() < 0.1) {
    return new NextResponse(null, {
      status: 503,
      statusText: "Service Unavailable",
    })
  }

  // Add artificial delay to simulate network latency (200-600ms)
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 400))

  return NextResponse.json(fruitsData)
}
