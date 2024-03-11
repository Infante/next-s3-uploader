"use client";

import React, { useState } from "react";
import Image from "next/image";

// Import our file uploader component
import FileUploader from "@/components/FileUploader";

export default function Home() {
	const [file, setFile] = useState<string>("");
	const [fileError, setFileError] = useState<string>("");

	return (
		<main className="bg-white flex min-h-screen flex-col items-center justify-center p-24">
			<FileUploader
				setFile={setFile}
				onFileChange={(newFile) => {
					setFile(newFile);
				}}
				setFileError={setFileError}
			>
				<div
					className={`w-40 h-40 shadow-sm border border-slate-200 bg-opacity-50 rounded-lg relative flex
          ${fileError ? "border-red-500" : "border-dashed"}
        `}
				>
					{file ? (
						<Image
							className="rounded-lg"
							layout="fill"
							objectFit="cover"
							alt="Uploaded image"
							blurDataURL={file}
							src={file}
						/>
					) : (
						<div
							className={`flex items-center justify-center w-full h-full text-xs
              ${fileError ? "text-red-500" : "text-slate-400"}
            `}
						>
							<span>{fileError ? fileError : "Upload File"}</span>
						</div>
					)}
				</div>
			</FileUploader>
		</main>
	);
}
