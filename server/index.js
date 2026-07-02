import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai"; // <-- Chat model import kiya

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

// CHAT ROUTE (Pure Approach B - LangChain)
app.get("/chat", async (req, res) => {
  try {
    const userQuery = req.query.message;

    // 1. Embeddings Initialize kiye
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-001",
    });

    // 2. Qdrant Existing Collection se connect kiya
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-testing",
      },
    );

    const retriever = vectorStore.asRetriever({
      k: 2,
    });

    // 3. Vector DB se relevant context nikala
    const results = await retriever.invoke(userQuery);

    // Document contents ko text format mein merge kiya context ke liye
    const contextText = results.map((doc) => doc.pageContent).join("\n\n");

    const SYSTEM_PROMPT = `You are a helpful assistant that answers questions based on the provided context. If the answer is not in the context, say "I don't know."
    
CONTEXT:
${contextText}`;

    // 4. LangChain ka Chat Model use kiya (No direct SDK!)
    // const model = new ChatGoogleGenerativeAI({
    //   apiKey: process.env.GOOGLE_API_KEY,
    //   modelName: "gemini-1.5-flash", // LangChain wrapper automatic endpoints setup handle karega
    //   maxOutputTokens: 2048,
    // });
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.5-flash",
});
    // 5. Model invoke kiya LangChain standard prompts array format mein
    const response = await model.invoke([
      ["system", SYSTEM_PROMPT],
      ["human", userQuery],
    ]);

    // LangChain response ek object hota hai jisme text .content property mein hota hai
    const answer = response.content;

    return res.json({
      results,
      answer,
    });
  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(8000, () => console.log(`Server started on PORT:${8000}`));
