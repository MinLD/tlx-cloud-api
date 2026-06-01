# TLX Cloud API

<<<<<<< HEAD
TLX Cloud API là backend sử dụng **Node.js + Express + TypeScript** cho dự án TLX Cloud.

## Tech stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Docker / Docker Compose
- DBeaver CE

## Cấu trúc chính

```txt
cloud/tlx-cloud-api/
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── routes/
│   │   └── health.route.ts
│   └── server.ts
├── docs/
│   └── postgresql-docker-dbeaver-setup.md
├── docker-compose.yml
├── index.ts
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Chạy project

### 1. Cài dependencies
=======
Backend API riêng cho dự án TLX, xây dựng bằng Express.js và Bun.

## Giới thiệu

Repo này là cloud backend tách riêng cho các chức năng:
- Authentication
- Workspace / Project management
- Scan ingestion
- Artifact storage
- Report serving
- Billing
- API monitoring

## Cấu trúc thư mục

```text
myapp/
├── index.js
├── package.json
└── src/
    ├── config/
    │   └── env.js
    ├── routes/
    │   └── health.route.js
    └── server.js
```

## Tên project

- Package name: `tlx-cloud-api`
- Service name: `TLX Cloud API`

## Chạy dự án

### Cài dependencies
>>>>>>> 939cbea220e3fc51da3156ec1ad4803c10c482d4

```bash
bun install
```

<<<<<<< HEAD
### 2. Tạo file `.env`

Copy từ `.env.example`:

```bash
copy .env.example .env
```

### 3. Chạy PostgreSQL bằng Docker

```bash
docker compose up -d
```

### 4. Chạy backend
=======
### Chạy development
>>>>>>> 939cbea220e3fc51da3156ec1ad4803c10c482d4

```bash
bun run dev
```

<<<<<<< HEAD
## Cấu hình môi trường

File `.env.example`:

```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=tlx
DB_PASSWORD=tlx@admin.com
DB_NAME=tlx_cloud
```

## Docker PostgreSQL

File `docker-compose.yml` dùng để khởi tạo PostgreSQL local cho development.

### Thông tin mặc định

- Host: `localhost`
- Port: `5432`
- Database: `tlx_cloud`
- Username: `tlx`
- Password: `tlx@admin.com`

## Tài liệu database

Xem hướng dẫn chi tiết tại:

- `docs/postgresql-docker-dbeaver-setup.md`

## Lưu ý khi push lên Git

### Nên push
- source code
- `README.md`
- `docs/`
- `docker-compose.yml`
- `.env.example`
- `.gitignore`

### Không nên push
- `.env`
- `node_modules`
- `dist`
- file log, cache, build artifacts

## Health check

API có route kiểm tra trạng thái:

```bash
GET /
GET /health
```

## License

Chưa khai báo.
=======
### Chạy production

```bash
bun run start
```

### Kiểm tra cú pháp

```bash
bun run check
```

## API hiện có

- `GET /` - thông tin service
- `GET /health` - health check

## Ghi chú

- Dự án đang dùng JavaScript module style (`type: module`)
- Cấu trúc hiện tại đã chuẩn hóa để mở rộng thêm `controllers`, `services`, `middlewares`, `models`, `validators`
- Đây là repo backend cloud riêng, tách khỏi CLI scanner và frontend dashboard
>>>>>>> 939cbea220e3fc51da3156ec1ad4803c10c482d4
