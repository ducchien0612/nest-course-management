FROM node:18-alpine

WORKDIR /app

# Cài đặt các công cụ build cần thiết trên Alpine
RUN apk add --no-cache build-base python3

# Sao chép file cấu hình và cài đặt dependencies
COPY package*.json ./
RUN npm install

# (Tuỳ chọn) Rebuild bcrypt từ source
RUN npm rebuild bcrypt --build-from-source

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng (nếu sử dụng TypeScript)
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
