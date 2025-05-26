import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Test connectivity to gateway service
        const gatewayUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

        // Quick health check to one service through gateway
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        try {
            const response = await fetch(`${gatewayUrl}/api/vegetables`, {
                method: 'HEAD',
                signal: controller.signal,
                cache: 'no-store'
            })

            clearTimeout(timeoutId)

            return NextResponse.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                service: 'frontend',
                gateway: {
                    status: response.ok ? 'reachable' : 'unreachable',
                    statusCode: response.status
                }
            })
        } catch (error) {
            clearTimeout(timeoutId)

            return NextResponse.json({
                status: 'degraded',
                timestamp: new Date().toISOString(),
                service: 'frontend',
                gateway: {
                    status: 'unreachable',
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            }, { status: 200 }) // Still return 200 for frontend health, but indicate degraded state
        }
    } catch (error) {
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            service: 'frontend',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}