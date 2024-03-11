"use client";
import React, { useRef, useState } from "react";

interface FileUploaderProps {
	setFile: React.Dispatch<React.SetStateAction<string>>;
	children: React.ReactNode;
	onFileChange?: (image: string) => void;
	setFileError: React.Dispatch<React.SetStateAction<string>>;
}

const FileUploader = ({ setFile, setFileError, children, onFileChange }: FileUploaderProps) => {
	// Refs and states
	const fileInputRef = useRef<React.ElementRef<"input">>(null);
	const [loading, setLoading] = useState(false);

	const handleButtonClick = () => {
		if (fileInputRef.current !== null) {
			fileInputRef.current.value = ""; // Clear the file input
			fileInputRef.current.click(); // Programmatically trigger the file input
		}
	};

	const handleFileChange = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			setFile(URL.createObjectURL(file));
			setFileError("");
			setLoading(true);
			submit(file);
		}
	};

	const submit = async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		fetch(`/api/upload`, {
			method: "POST",
			credentials: "include",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setLoading(false);
					setFile(data.src);
					// Call onImageChange callback if it exists
					if (onFileChange) {
						onFileChange(data.src);
					}
				} else {
					setLoading(false);
					setFileError(data.error);
				}
			});
	};

	return (
		<>
			<div
				className="relative hover:cursor-pointer"
				onClick={() => {
					if (loading) return;
					handleButtonClick();
				}}
			>
				{/* Render our child component that should have our image/file */}
				{children}

				{/* Loading component */}
				{loading && (
					<div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm`}>...</div>
				)}
			</div>

			{/* Invisible file input*/}
			<input ref={fileInputRef} type="file" className="hidden w-0 h-0 opacity-0" onChange={handleFileChange} />
		</>
	);
};

export default FileUploader;
