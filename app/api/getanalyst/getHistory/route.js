import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import NormalUser from "../../../../models/NormalUser";
import StudentUser from "../../../../models/StudentUser";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/auth.config'; // ปรับ path ให้ถูกต้องตามโครงสร้างโปรเจค

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    // ตรวจสอบ session ก่อน
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await connectMongoDB();

    // ดึงข้อมูลจาก database
    const [normalUsers, studentUsers, normalUserCount, studentUserCount] = await Promise.all([
      NormalUser.find({}, 'roleai createdAt').lean(),
      StudentUser.find({}, 'roleai createdAt').lean(),
      NormalUser.countDocuments({}),
      StudentUser.countDocuments({})
    ]);

    // รวมจำนวนผู้ใช้ทั้งหมด
    const totalUserCount = normalUserCount + studentUserCount;

    // สร้าง array ของข้อมูลผู้ใช้ทั้งหมด
    const allUsers = [
      ...normalUsers.map(user => ({
        date: user.createdAt,
        roleai: user.roleai,
        type: 'normal'
      })),
      ...studentUsers.map(user => ({
        date: user.createdAt,
        roleai: user.roleai,
        type: 'student'
      }))
    ];

    // เรียงข้อมูลตามวันที่
    allUsers.sort((a, b) => new Date(b.date) - new Date(a.date));

    // สร้าง response object
    const response = {
      totalUsers: totalUserCount,
      normalUserCount,
      studentUserCount,
      userHistory: allUsers,
      summary: {
        normal: {
          student: normalUsers.filter(u => u.roleai === 'student').length,
          developer: normalUsers.filter(u => u.roleai === 'developer').length,
          other: normalUsers.filter(u => u.roleai === 'other').length
        },
        student: {
          student: studentUsers.filter(u => u.roleai === 'student').length,
          developer: studentUsers.filter(u => u.roleai === 'developer').length,
          other: studentUsers.filter(u => u.roleai === 'other').length
        }
      }
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error in getHistory:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}