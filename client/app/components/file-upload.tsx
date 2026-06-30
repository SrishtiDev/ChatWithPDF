"use client";
import * as React from "react";
import { Upload } from "lucide-react";

const FileUploadComponent: React.FC = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        const formData = new FormData();
        formData.append("pdf", file);

        try {
          await fetch("http://localhost:8000/upload/pdf", {
            method: "POST",
            body: formData,
          });
          console.log("File uploaded");
          alert("File uploaded successfully!");
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("Failed to upload file.");
        }
      }
    }
    
    // Clear the input to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white border-2">
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={handleFileUploadButtonClick}
        className="flex justify-center items-center flex-col cursor-pointer"
      >
        <h3>Upload PDF File</h3>
        <Upload className="mt-2" />
      </div>
    </div>
  );
};

export default FileUploadComponent;
