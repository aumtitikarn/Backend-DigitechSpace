import { connectMongoDB } from "../../../lib/mongodb";
import NormalUser from "../../../models/NormalUser";
import StudentUser from "../../../models/StudentUser";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectMongoDB();

        // Use searchParams from the Request object
        const { searchParams } = new URL(request.url);
        const selectedMonth = searchParams.get('month');
        const selectedYear = searchParams.get('year');

        // Define filter conditions
        let dateFilter = {};

        if (selectedMonth !== "All" && selectedYear !== "All") {
            const startDate = new Date(`${selectedYear}-${selectedMonth}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            
            dateFilter = {
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            };
        }

        // Execute queries with the filter
        const [normalUsers, studentUsers, normalUserCount, studentUserCount] = await Promise.all([
            NormalUser.find(dateFilter, 'roleai').lean(),
            StudentUser.find(dateFilter, 'roleai').lean(),
            NormalUser.countDocuments(dateFilter),
            StudentUser.countDocuments(dateFilter)
        ]);

        const totalUserCount = normalUserCount + studentUserCount;

        // Return the response
        return NextResponse.json({
            normalUsers,
            studentUsers,
            totalUserCount,
            metadata: {
                month: selectedMonth,
                year: selectedYear,
                normalCount: normalUserCount,
                studentCount: studentUserCount
            }
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store'
            }
        });

    } catch (error) {
        console.error("Error fetching role data:", error);
        return NextResponse.json(
            { error: "Failed to fetch role data", details: error.message },
            { status: 500 }
        );
    }
}

// Add configuration to mark this as dynamic
export const dynamic = 'force-dynamic';