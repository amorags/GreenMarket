"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Apple, Cherry, Banana, Carrot, Leaf, AlertTriangle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define type for our food data
type FoodItem = {
  id: number
  name: string
  category: "Berries" | "Fruits" | "Vegetables" | "Nuts" | "Seeds"
  color: string
  calories: number
  inSeason: boolean
}

// Define type for service status
type ServiceStatus = {
  Berries: boolean
  Fruits: boolean
  Vegetables: boolean
  Nuts: boolean
  Seeds: boolean
}

// Timeout configuration
const API_TIMEOUT = 10000 // 10 seconds
const HEALTH_CHECK_TIMEOUT = 5000 // 5 seconds for health checks

export default function FoodDataPage() {
  const [data, setData] = useState<FoodItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<
    "all" | "Berries" | "Fruits" | "Vegetables" | "Nuts" | "Seeds" | null
  >(null)
  // Track which services are available
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    Berries: true,
    Fruits: true,
    Vegetables: true,
    Nuts: true,
    Seeds: true,
  })
  // Track service outage messages
  const [serviceMessages, setServiceMessages] = useState<string[]>([])
  // Track if we're checking service health
  const [checkingHealth, setCheckingHealth] = useState(false)

  // Check health of all services with timeout
  const checkServiceHealth = async () => {
    setCheckingHealth(true)
    const newStatus = { ...serviceStatus }
    const messages: string[] = []

    // Check each service through the gateway
    const services: Array<keyof ServiceStatus> = ["Berries", "Fruits", "Vegetables", "Nuts", "Seeds"]

    for (const service of services) {
      try {
        // Use the gateway endpoint for health checks
        const endpoint = `http://localhost:5000/api/${service.toLowerCase()}`

        // Create AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT)

        const response = await fetch(endpoint, {
          method: "HEAD", // Use HEAD request to check availability without fetching data
          cache: "no-store", // Prevent caching
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        newStatus[service] = response.ok

        if (!response.ok) {
          messages.push(
            `${service} service is currently down for maintenance (HTTP ${response.status}). Please try again later.`,
          )
        }
      } catch (error) {
        console.error(`Error checking ${service} service health:`, error)
        newStatus[service] = false

        if (error instanceof Error && error.name === "AbortError") {
          messages.push(
            `${service} service is not responding (timeout after ${HEALTH_CHECK_TIMEOUT / 1000}s). Please try again later.`,
          )
        } else {
          messages.push(`${service} service is currently unavailable. Please try again later.`)
        }
      }
    }

    setServiceStatus(newStatus)
    setServiceMessages(messages)
    setCheckingHealth(false)

    // If the active category service goes down, clear the data
    if (activeCategory && activeCategory !== "all" && !newStatus[activeCategory as keyof ServiceStatus]) {
      setData(null)
      setActiveCategory(null)
    }
  }

  // Initial health check on component mount
  useEffect(() => {
    checkServiceHealth()

    // Set up periodic health checks (every 30 seconds)
    const intervalId = setInterval(checkServiceHealth, 30000)

    // Clean up on unmount
    return () => clearInterval(intervalId)
  }, [])

  // Function to fetch all food data from all available services with timeout
  const fetchAllFood = async () => {
    setLoading(true)
    setActiveCategory("all")

    try {
      const allData: FoodItem[] = []
      const services: Array<keyof ServiceStatus> = ["Berries", "Fruits", "Vegetables", "Nuts", "Seeds"]

      // Only fetch from available services
      for (const service of services) {
        if (serviceStatus[service]) {
          try {
            const endpoint = `http://localhost:5000/api/${service.toLowerCase()}`

            // Create AbortController for timeout
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

            const response = await fetch(endpoint, {
              cache: "no-store",
              signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (response.ok) {
              const serviceData = await response.json()
              allData.push(...serviceData)
            }
          } catch (error) {
            console.error(`Error fetching ${service} data:`, error)

            // Update service status if this was an unexpected failure
            const newStatus = { ...serviceStatus }
            newStatus[service] = false
            setServiceStatus(newStatus)

            if (error instanceof Error && error.name === "AbortError") {
              setServiceMessages([
                ...serviceMessages,
                `${service} service timed out (${API_TIMEOUT / 1000}s). Please try again later.`,
              ])
            } else {
              setServiceMessages([
                ...serviceMessages,
                `${service} service failed unexpectedly. Please try again later.`,
              ])
            }
          }
        }
      }

      setData(allData)
    } catch (error) {
      console.error("Error fetching all food data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch food by category with circuit breaker and timeout
  const fetchFoodByCategory = async (category: "Berries" | "Fruits" | "Vegetables" | "Nuts" | "Seeds") => {
    // Check if service is available (circuit breaker pattern)
    if (!serviceStatus[category]) {
      console.error(`${category} service is currently unavailable`)
      return
    }

    setLoading(true)
    setActiveCategory(category)

    try {
      const endpoint = `http://localhost:5000/api/${category.toLowerCase()}`

      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

      const response = await fetch(endpoint, {
        cache: "no-store",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`${category} service returned status ${response.status}`)
      }

      const categoryData = await response.json()
      setData(categoryData)
    } catch (error) {
      console.error(`Error fetching ${category}:`, error)

      // Update service status if this was an unexpected failure
      const newStatus = { ...serviceStatus }
      newStatus[category] = false
      setServiceStatus(newStatus)

      // Add error message based on error type
      if (error instanceof Error && error.name === "AbortError") {
        setServiceMessages([
          ...serviceMessages,
          `${category} service timed out after ${API_TIMEOUT / 1000} seconds. Please try again later.`,
        ])
      } else {
        setServiceMessages([...serviceMessages, `${category} service failed unexpectedly. Please try again later.`])
      }

      // Clear data and active category
      setData(null)
      setActiveCategory(null)
    } finally {
      setLoading(false)
    }
  }

  // Get the appropriate icon for each category button
  const getCategoryIcon = (category: "all" | "Berries" | "Fruits" | "Vegetables" | "Nuts" | "Seeds") => {
    switch (category) {
      case "all":
        return <Apple className="mr-2 h-4 w-4" />
      case "Berries":
        return <Cherry className="mr-2 h-4 w-4" />
      case "Fruits":
        return <Banana className="mr-2 h-4 w-4" />
      case "Vegetables":
        return <Carrot className="mr-2 h-4 w-4" />
      case "Nuts":
        return <Leaf className="mr-2 h-4 w-4" />
      case "Seeds":
        return <Leaf className="mr-2 h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">GreenMarket</h1>
        <Button onClick={checkServiceHealth} variant="outline" size="sm" disabled={checkingHealth}>
          {checkingHealth ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking Services...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Service Status
            </>
          )}
        </Button>
      </div>

      {/* Service status alerts */}
      {serviceMessages.length > 0 && (
        <div className="space-y-4">
          {serviceMessages.map((message, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Service Unavailable</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Timeout information */}
      <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <p>
          <strong>Timeout Settings:</strong> Health checks timeout after {HEALTH_CHECK_TIMEOUT / 1000}s, data requests
          timeout after {API_TIMEOUT / 1000}s
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button
          onClick={fetchAllFood}
          disabled={loading || Object.values(serviceStatus).every((status) => !status)}
          variant={activeCategory === "all" ? "default" : "outline"}
        >
          {loading && activeCategory === "all" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading All Food...
            </>
          ) : (
            <>
              {getCategoryIcon("all")}
              All Available Food
            </>
          )}
        </Button>

        {serviceStatus.Berries && (
          <Button
            onClick={() => fetchFoodByCategory("Berries")}
            disabled={loading}
            variant={activeCategory === "Berries" ? "default" : "outline"}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading && activeCategory === "Berries" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Berries...
              </>
            ) : (
              <>
                {getCategoryIcon("Berries")}
                Berries
              </>
            )}
          </Button>
        )}

        {serviceStatus.Fruits && (
          <Button
            onClick={() => fetchFoodByCategory("Fruits")}
            disabled={loading}
            variant={activeCategory === "Fruits" ? "default" : "outline"}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {loading && activeCategory === "Fruits" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Fruits...
              </>
            ) : (
              <>
                {getCategoryIcon("Fruits")}
                Fruits
              </>
            )}
          </Button>
        )}

        {serviceStatus.Vegetables && (
          <Button
            onClick={() => fetchFoodByCategory("Vegetables")}
            disabled={loading}
            variant={activeCategory === "Vegetables" ? "default" : "outline"}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {loading && activeCategory === "Vegetables" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Vegetables...
              </>
            ) : (
              <>
                {getCategoryIcon("Vegetables")}
                Vegetables
              </>
            )}
          </Button>
        )}

        {serviceStatus.Nuts && (
          <Button
            onClick={() => fetchFoodByCategory("Nuts")}
            disabled={loading}
            variant={activeCategory === "Nuts" ? "default" : "outline"}
            className="bg-amber-700 hover:bg-amber-800 text-white"
          >
            {loading && activeCategory === "Nuts" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Nuts...
              </>
            ) : (
              <>
                {getCategoryIcon("Nuts")}
                Nuts
              </>
            )}
          </Button>
        )}

        {serviceStatus.Seeds && (
          <Button
            onClick={() => fetchFoodByCategory("Seeds")}
            disabled={loading}
            variant={activeCategory === "Seeds" ? "default" : "outline"}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading && activeCategory === "Seeds" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Seeds...
              </>
            ) : (
              <>
                {getCategoryIcon("Seeds")}
                Seeds
              </>
            )}
          </Button>
        )}
      </div>

      {data ? (
        <Table>
          <TableCaption>
            {activeCategory === "all"
              ? "Food items from all available services"
              : `Food items from the ${activeCategory} service`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Calories (per 100g)</TableHead>
              <TableHead className="text-right">In Season</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell className="text-right">{item.calories}</TableCell>
                  <TableCell className="text-right">{item.inSeason ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No data available from this service
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          {serviceMessages.length > 0 && Object.values(serviceStatus).every((status) => !status)
            ? "All services are currently unavailable. Please try again later."
            : serviceMessages.length > 0
              ? "Some services are currently unavailable. Please try available categories."
              : "Click one of the buttons above to fetch food data"}
        </div>
      )}
    </div>
  )
}
