import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    try {
      console.log(`Job: ${job.id}`);

      const data = JSON.parse(job.data);

      const loader = new PDFLoader(data.path);
      const docs = await loader.load();

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const splitDocs = await splitter.splitDocuments(docs);

      console.log(`Chunks: ${splitDocs.length}`);


      // const embeddings = new OpenAIEmbeddings({
      //   model: "text-embedding-3-small",
      //   openAIApiKey: process.env.OPENAI_API_KEY,
      // });
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-001",
    });

      console.log("Creating collection...");

      await QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-testing",
      });

      console.log("Documents added to Qdrant");
    } catch (err) {
      console.error("ERROR:");
      console.error(err);
    }
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);
