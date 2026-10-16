# Stage 1: Build 
FROM node:22-alpine AS builder
WORKDIR /app

# ติดตั้ง dependencies ทั้งหมด
COPY package*.json ./
RUN npm install --legacy-peer-deps

# ก๊อปปี้โค้ดทั้งหมดแล้วสั่ง build (แปลง TypeScript เป็น JavaScript)
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app

# ติดตั้งเฉพาะ dependencies ที่จำเป็นต้องใช้รันบนเซิร์ฟเวอร์
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# นำไฟล์ที่ build เสร็จแล้วจาก Stage 1 มาใช้งาน
COPY --from=builder /app/dist ./dist

# เปิด Port 3000 และสั่งรันแอปพลิเคชัน
EXPOSE 3000
CMD ["node", "dist/main"]