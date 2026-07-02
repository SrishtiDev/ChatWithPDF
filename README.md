# ChatWithPDF 📄🤖

ChatWithPDF is a full-stack Retrieval-Augmented Generation (RAG) application that allows users to upload PDF documents and have real-time, context-aware conversations with an AI assistant based on the document's content.

---

## 🚀 Tech Stack

### Frontend (Client)
* **Framework:** Next.js (App Router, Turbopack)
* **Authentication:** Clerk Auth
* **UI Components:** Shadcn UI & Radix UI
* **Styling:** Tailwind CSS
* **Icons:** Lucide React

### Backend (Server & Worker)
* **Runtime:** Node.js (Express)
* **Orchestration / LLM Framework:** LangChain JS
* **LLM & Embeddings:** Google Gemini API (`gemini-1.5-flash` / `gemini-embedding-001`)
* **Vector Database:** Qdrant DB
* **Queue Management:** BullMQ (powered by Redis)
* **File Uploads:** Multer

---

## 🛠️ Project Structure

```text
├── client/          # Next.js frontend application
├── server/          # Node.js Express backend and asynchronous workers
⚙️ Getting Started
Prerequisites
Make sure you have the following installed on your local machine:

Node.js (v18+ recommended)

pnpm (Package Manager)

Redis Server (Required for BullMQ queues)

Qdrant DB instance (Cloud or Local Docker container)

1. Backend Setup (server/)
Navigate to the server folder:

Bash
cd server
Install dependencies:

Bash
pnpm install
Create a .env file in the server root directory and add your environment variables:

Code snippet
PORT=8000
GOOGLE_API_KEY=your_gemini_api_key_here
QDRANT_URL=your_qdrant_db_url_here
REDIS_HOST=localhost
REDIS_PORT=6379
Start the Express server and asynchronous background worker simultaneously:

Start API Server:

Bash
pnpm dev
Start Queue Worker (In a separate terminal window):

Bash
pnpm run dev:worker
2. Frontend Setup (client/)
Navigate to the client folder:

Bash
cd ../client
Install dependencies:

Bash
pnpm install
Create a .env file in the client root directory and add your authentication keys:

Code snippet
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
Start the frontend development server:

Bash
pnpm dev
Open http://localhost:3000 in your browser to view and use the application.

💡 How It Works
Upload Phase: A user uploads a PDF using the frontend interface. The file is sent via multer to the server, which dispatches a job to a BullMQ queue.

Ingestion Worker: The background worker picks up the job, parses the PDF chunks, converts them into embeddings via the Google Gemini Embeddings model, and stores them securely inside a Qdrant Vector Database collection.

Retrieval & Chat: When the user types a question, the frontend sends a request to the backend. The server runs a semantic lookup inside Qdrant to retrieve relevant document pieces and passes them along as context into the Google Gemini LLM to construct an accurate response.
