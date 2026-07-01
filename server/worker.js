import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import  { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log(`Job: ${job.id}`);
    const data = JSON.parse(job.data);


    //Load the PDF file from the specified path
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();

    //Chunk the PDF into smaller pieces
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 0,
    });
    const texts = splitter.splitText(document);
    console.log(`Number of chunks: ${texts.length}`);
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: "6379",
    },
  },
);


/*Path :data.path
read the pdf from path,
chunk the pdf,
call the openai embedding model for every chunk,
store the chunk in quandt db

*/