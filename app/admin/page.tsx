"use client"

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

type ChartDataType = { date: string; order: number; sales: number }

const chartConfig = {
    order: {
        label: "Total Order",
        color: "hsl(var(--chart-1))",
    },
    sales: {
        label: "Total Sales (RM)",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const ChartComponent = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("order")
    const [activeFilter, setActiveFilter] = useState<"week" | "month" | "year">("week")
    const [chartData, setChartData] = useState<ChartDataType[]>([])

    const total = {
        order: chartData.reduce((acc, curr) => acc + curr.order, 0),
        sales: chartData.reduce((acc, curr) => acc + curr.sales, 0),
    }

    useEffect(() => {
        setIsLoading(true)
        setChartData([])
        fetch("/api/admin/dashboard_GetChartData", {
            method: "POST",
            body: JSON.stringify({ filter: activeFilter })
        })
            .then((res) => res.json())
            .then((data) => {
                setChartData(data)
                setIsLoading(false)
            })
    }, [activeFilter])

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant={activeFilter === "week" ? "default" : "outline"}
                            onClick={() => setActiveFilter("week")}
                            disabled={isLoading}
                        >Week</Button>
                        <Button
                            variant={activeFilter === "month" ? "default" : "outline"}
                            onClick={() => setActiveFilter("month")}
                            disabled={isLoading}
                        >Month</Button>
                        <Button
                            variant={activeFilter === "year" ? "default" : "outline"}
                            onClick={() => setActiveFilter("year")}
                            disabled={isLoading}
                        >Year</Button>
                    </div>
                </div>
                <div className="flex">
                    {["order", "sales"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 min-w-[150px]"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total[key as keyof typeof total].toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                {isLoading ? (
                    <Skeleton className="h-[500px] w-full" />
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[500px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: activeFilter !== "year" ? "numeric" : undefined,
                                    })
                                }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: activeFilter !== "year" ? "numeric" : undefined,
                                                year: "numeric",
                                            })
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                        </BarChart>
                    </ChartContainer>
                )
                }
            </CardContent>
        </Card>
    )
}

const AdminDashboard = () => {
    return (
        <div className="w-full">
            <span className="text-3xl font-bold">Dashboard</span>
            <p className="text-muted-foreground my-4">Your website overview</p>
            <ChartComponent />
        </div>
    )
}

export default AdminDashboard;