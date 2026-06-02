# TLX Cloud API

Backend API của dự án TLX Cloud, được xây dựng bằng **Express.js + TypeScript** và chạy bằng **Bun**.  
Dự án này cung cấp các API cho authentication, user, workspace và các module mở rộng về sau.

---

## 1. Công nghệ sử dụng

- **Runtime**: Bun
- **Framework**: Express.js 5
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **Authentication**: JSON Web Token (JWT)
- **Hash password**: bcryptjs
- **Logging**: morgan
- **Environment config**: dotenv
- **Reusable response helper**: custom shared API response utility

---

## 2. Chức năng chính

- Đăng ký / đăng nhập / đăng xuất
- Xác thực người dùng bằng JWT
- Middleware bảo vệ route
- Kết nối PostgreSQL bằng Prisma
- Cấu trúc code theo module, dễ mở rộng
- Tách rõ phần:
  - controller
  - service
  - repository
  - route
  - shared utilities / types / errors

---

## 3. Yêu cầu môi trường

Trước khi chạy dự án, cần có:

- **Bun**: https://bun.sh
- **Node.js**: khuyến nghị bản LTS nếu cần tương thích tool phụ trợ
- **PostgreSQL** đang chạy
- **Git**

---

## 4. Cách clone dự án

```bash
git clone https://github.com/MinLD/tlx-cloud-api.git
cd tlx-cloud-api
```

---

## 5. Cài đặt dependencies

Dự án dùng Bun nên cài bằng:

```bash
bun install
```

---

## 6. Cấu hình biến môi trường

Copy file mẫu:

```bash
copy .env.example .env
```

Sau đó chỉnh file `.env` cho phù hợp với máy của bạn.

### Ví dụ `.env`

```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=tlx
DB_PASSWORD=tlx@admin.com
DB_NAME=tlx_cloud
```

> Lưu ý: ngoài các biến trên, project hiện tại còn có thể dùng `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` tùy phần cấu hình Prisma / auth trong source code.  
> Nếu thiếu, cần kiểm tra thêm file `src/config/env.ts` và `src/lib/prisma.ts`.

---

## 7. Chạy database

Nếu bạn dùng Docker Compose:

```bash
docker compose up -d
```

Sau đó kiểm tra PostgreSQL đã sẵn sàng.

---

## 8. Prisma

Nếu cần sinh client hoặc chạy migration, dùng các lệnh Prisma phù hợp với setup hiện tại:

```bash
bunx prisma generate
bunx prisma migrate dev
```

> Nếu bạn chỉ muốn chạy app trong môi trường đã có database sẵn, hãy đảm bảo schema và dữ liệu đã đúng.

---

## 9. Chạy dự án

### Chạy ở chế độ development

```bash
bun run dev
```

### Chạy production

```bash
bun run start
```

---

## 10. Kiểm tra TypeScript

```bash
bun run build
```

Lệnh này đang chạy `tsc --noEmit` để kiểm tra type.

---

## 11. Kiểm tra cú pháp Bun

```bash
bun run check
```

---

## 12. Cấu trúc dự án

```bash
src/
├── config/
│   └── env.ts
├── controller/
│   ├── auth.controller.ts
│   └── user.controller.ts
├── generated/
│   └── prisma/
├── lib/
│   └── prisma.ts
├── middleware/
│   └── auth.middleware.ts
├── modules/
│   └── auth/
├── repositories/
│   └── user.repository.ts
├── routes/
│   ├── auth.route.ts
│   └── user.route.ts
├── services/
│   ├── auth.service.ts
│   └── user.service.ts
├── shared/
│   ├── errors/
│   ├── types/
│   ├── utils/
│   └── validation/
└── server.ts
```

---

## 13. Giải thích cấu trúc thư mục

### `src/config`
Chứa các cấu hình runtime của ứng dụng, ví dụ:
- đọc biến môi trường
- cấu hình mặc định
- runtime config dùng toàn app

### `src/lib`
Chứa các instance / adapter của thư viện bên ngoài, ví dụ:
- Prisma client
- kết nối database
- các singleton hoặc wrapper hạ tầng

### `src/controller`
Nhận request từ route và trả response cho client.  
Controller chỉ nên xử lý:
- input từ request
- gọi service
- trả status / data / error

### `src/services`
Chứa business logic chính của app.  
Đây là nơi xử lý nghiệp vụ, không nên gắn trực tiếp với Express request/response.

### `src/repositories`
Chứa tầng truy vấn dữ liệu, làm việc với database thông qua Prisma.

### `src/routes`
Khai báo route của Express và gắn middleware/controller.

### `src/middleware`
Chứa middleware của Express như:
- auth guard
- logger
- xử lý lỗi
- parse request liên quan đến auth

### `src/modules`
Chứa các module theo feature.  
Hiện tại có module `auth`, có thể mở rộng thêm các module khác sau này.

### `src/shared`
Chứa các phần dùng chung toàn project:
- `errors`: custom error classes
- `types`: type dùng chung
- `utils`: helper functions dùng chung, ví dụ:
  - `apiResponse.ts`
  - `authCookie.ts`
  - `asyncHandler.ts`
  - `generateToken.ts`
- `validation`: schema validation dùng chung

### `src/generated`
Chứa code generated từ Prisma.  
Không nên sửa tay nếu đây là output generated.

---

## 14. Luồng chạy cơ bản của app

1. `server.ts` khởi động server
2. `config/env.ts` đọc biến môi trường
3. `lib/prisma.ts` khởi tạo Prisma client
4. Route nhận request
5. Controller xử lý request
6. Service xử lý nghiệp vụ
7. Repository thao tác database
8. Response được trả về client

---

## 15. Quy ước code hiện tại

- Dùng **ES Modules**
- Dùng **TypeScript**
- Dùng **zod** để validate input
- Dùng helper response dùng chung để thống nhất format JSON
- Tách logic theo layers rõ ràng
- Ưu tiên code ngắn, dễ đọc, dễ mở rộng

---

## 16. Ghi chú

- Nếu dự án thay đổi structure hoặc thêm module mới, hãy cập nhật lại README này để đồng bộ.
- Không nên sửa trực tiếp file trong `src/generated` nếu đó là code được generate.
- Nếu thay đổi schema Prisma, nhớ chạy lại generate/migrate.

---

## 17. Tác giả / Project

- Project: **TLX Cloud API**
- Stack: **Express.js + TypeScript + Prisma + PostgreSQL**