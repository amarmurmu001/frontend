# AI-Powered Hinglish Cyberbullying & Hate Speech Detector

This is a full-stack web application that detects toxicity in English, Hindi, and Hinglish (Romanized Hindi). It features a modern, dark-themed dashboard using Glassmorphism, a Node.js API Gateway, and a Python FastAPI ML microservice.

## Structure

- `frontend/`: React + Tailwind CSS dashboard
- `backend-node/`: Express API gateway connecting to MongoDB
- `backend-python/`: FastAPI ML service using transformers

## Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB running locally or a MongoDB Atlas URI

## Setup Instructions

### 1. Model Configuration

To run the ML service, you need to place your local SAFETENSORS model in the `backend-python/hate_model` directory.

Create the directory (if not exists):
```bash
mkdir -p backend-python/hate_model
```

Place the following files inside `backend-python/hate_model/`:
- `model.safetensors`
- `config.json`
- `vocab.txt`
- `tokenizer_config.json`
- `special_tokens_map.json`

*(Make sure these files match your HuggingFace/transformers model configuration).*

### 2. Environment Variables

Copy the `.env.example` file to `.env` in the root (for reference) and in respective backend directories if needed:

For Node.js Backend (`backend-node/.env`):
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cyberbullying
PYTHON_ML_URL=http://localhost:8000/v1/predict

### 3. Running the Node Backend

```bash
cd backend-node
npm install
npm start
```

### 4. Running the Python ML Microservice

```bash
cd backend-python
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 5. Running the Frontend

```bash
cd frontend
npm run dev
```

Visit the frontend at `http://localhost:5173`.
