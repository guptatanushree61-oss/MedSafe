# MedSafe

MedSafe is a MERN application that lets users scan or upload an image of a medicine label / strip, automatically extract the **medicine name** and **expiry date** using an OCR microservice, store the result in MongoDB, and warn the user when medicines are expired or expiring soon.

## Architecture

```
React (Vite + Tailwind)  ──►  Node / Express API  ──►  Python OCR (FastAPI + EasyOCR + OpenCV)
                                       │
                                       ▼
                                    MongoDB
```

## Project structure

```
medsafe/
├── client/         # React + Vite + Tailwind frontend (JSX)
├── server/         # Node + Express + Mongoose backend
└── ocr-service/    # Python FastAPI + EasyOCR + OpenCV microservice
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)

## 1. OCR service

```bash
cd ocr-service
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

The first run downloads EasyOCR models (a few hundred MB).

## 2. Backend

```bash
cd server
cp .env.example .env               # then edit MONGO_URI
npm install
npm run dev
```

API runs on `http://localhost:5000`.

## 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

App runs on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint                  | Purpose                              |
|--------|---------------------------|--------------------------------------|
| POST   | /api/upload-medicine      | Upload image (multipart)             |
| POST   | /api/extract-medicine     | Run OCR on uploaded image, save it   |
| GET    | /api/medicines            | List all saved medicines             |
| DELETE | /api/medicine/:id         | Delete a medicine                    |
| PUT    | /api/medicine/:id         | Update a medicine                    |

## Expiry detection

Regex covers: `EXP 08/2026`, `EXP: 12/25`, `Expiry Date: 15/11/2027`,
`EXP. 2026-08`, `Best before 08-2026`, etc.

## Status colors

- Green  → safe (> 30 days)
- Yellow → expiring within 30 days
- Red    → expired
