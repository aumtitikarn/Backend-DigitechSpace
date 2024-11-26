import { connectMongoDB } from "../../../lib/mongodb";
import { Order } from '../../../models/Getseller';
import { projects } from '../../../models/Getproject';

export async function GET(req) {
  try {
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();

    // ดึงข้อมูลออเดอร์ที่สถานะเป็น "successful"
    const orders = await Order.find({ status: 'successful' }, 'product createdAt');
    console.log("Orders fetched: ", orders);

    // ตรวจสอบว่ามีออเดอร์ให้ประมวลผลหรือไม่
    if (orders.length === 0) {
      return new Response(JSON.stringify({ message: 'ไม่พบออเดอร์ที่สำเร็จ' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ดึง product IDs จากออเดอร์
    const productIds = orders.map(order => order.product);
    console.log("Product IDs from orders: ", productIds);

    // ดึงข้อมูลผลิตภัณฑ์ที่ขายตาม product IDs
    const products = await projects.find({ _id: { $in: productIds } }, 'price category _id');
    console.log("Fetched Products: ", products);

    // ตรวจสอบว่าพบผลิตภัณฑ์หรือไม่
    if (products.length === 0) {
      return new Response(JSON.stringify({ message: 'ไม่พบผลิตภัณฑ์ตาม product IDs ที่ให้มา' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // สร้างแผนที่สำหรับข้อมูลผลิตภัณฑ์ โดยใช้ `_id` เป็นคีย์
    const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product;
      return acc;
    }, {});

    // เก็บข้อมูลผลรวมราคาต่อ product (รวมจากออเดอร์)
    const orderProductPrices = orders.reduce((acc, order) => {
      const productId = order.product.toString();

      // ถ้าพบ `_id` ของ product ในแผนที่
      if (productMap[productId]) {
        if (!acc[productId]) {
          acc[productId] = {
            price: productMap[productId].price,
            category: productMap[productId].category,
            totalPrice: productMap[productId].price, // บวกราคาเริ่มต้น
            count: 1, // นับจำนวนครั้งที่ใช้ product นี้
            createdAt: order.createdAt,
          };
        } else {
          acc[productId].totalPrice += productMap[productId].price; // บวกราคาเพิ่ม
          acc[productId].count += 1; // นับจำนวนครั้งที่ใช้
        }
      }
      return acc;
    }, {});

    // เตรียมข้อมูลยอดขายจากการบวกราคาและจัดกลุ่มตาม category
    const salesData = Object.values(orderProductPrices).reduce((acc, productData) => {
      const { category, totalPrice, count, createdAt } = productData;

      // ค้นหา category ใน acc ถ้าไม่พบให้สร้างใหม่
      if (!acc[category]) {
        acc[category] = {
          price: totalPrice, // รวมราคาที่เริ่มต้น
          category: category,
          count: count, // เริ่มต้นด้วยจำนวนที่ใช้ผลิตภัณฑ์นี้
          createdAt: createdAt, // เก็บ createdAt ใดๆ
        };
      } else {
        acc[category].price += totalPrice; // บวกราคาเพิ่มใน category เดียวกัน
        acc[category].count += count; // บวกจำนวน count
      }

      return acc;
    }, {});

    // แปลงผลลัพธ์จาก object เป็น array
    const groupedSalesData = Object.values(salesData);

    console.log(groupedSalesData);

    // คืนข้อมูลยอดขายในรูปแบบ JSON ด้วยสถานะ 200
    return new Response(JSON.stringify(groupedSalesData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error during fetching:", error);

    // คืนสถานะข้อผิดพลาด 500 หากมีบางอย่างผิดพลาด
    return new Response(JSON.stringify({ message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
