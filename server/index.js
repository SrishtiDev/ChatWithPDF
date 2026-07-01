import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: "6379",
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  return res.json({ status: "All Good!" });
});

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  await queue.add(
    "file-ready",
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
    }),
  );
  return res.json({
    message: "uploaded successfully",
    file: req.file,
  });
});

// app.get("/chat", (req, res) => {
//   const userQuery = "What is validator?";
//    const embeddings = new GoogleGenerativeAIEmbeddings({
//       apiKey: process.env.GOOGLE_API_KEY,
//       model: "gemini-embedding-001",
//     });
//    const vectorStore = await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
//    url: process.env.QDRANT_URL,
//    collectionName: "langchainjs-testing",
//  });
//  const retriever = vectorStore.asRetriever({
//   filter: filter,
//   k: 2,
// });
// const results = await retriever.invoke("userQuery");
// });
// 1. Function ke aage async lagaya (req, res) se pehle
app.get("/chat", async (req, res) => {
  try {
    const userQuery = "What are skills?";

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-001",
    });

    // NOTE: Yahan vectorStore ko fromDocuments se dubara create karne ki zaroorat nahi hai.
    // Hum sirf Qdrant se connect kar rahe hain query karne ke liye!
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-testing",
      },
    );

    const retriever = vectorStore.asRetriever({
      k: 2, // Agar extra filter variable nahi hai toh use hata do
    });

    // "userQuery" se quotes hata diye taaki variable use ho
    const results = await retriever.invoke(userQuery);

    return res.json({ results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => console.log(`Server started on PORT:${8000}`));
