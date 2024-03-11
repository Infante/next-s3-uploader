import { Endpoint } from "aws-sdk";
import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// Determine the storage service to use based on the STORAGE_SERVICE environment variable.
// This variable can be set to "AWS" or "DIGITALOCEAN"
// If not specified, it defaults to "AWS".
const storageService = process.env.STORAGE_SERVICE || "AWS"; // Default to AWS if not specified
let s3: S3Client;

if (storageService.toUpperCase() === "DIGITALOCEAN") {
	// Configuration for DigitalOcean Spaces
	const spacesEndpoint = new Endpoint(process.env.SPACES_ENDPOINT || "nyc3.digitaloceanspaces.com");
	s3 = new S3Client({
		credentials: {
			accessKeyId: process.env.ACCESS_KEY_ID || "",
			secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
		},
		region: process.env.REGION || "us-east-1",
		endpoint: spacesEndpoint as any,
	});
} else {
	// Default configuration for AWS S3
	s3 = new S3Client({
		credentials: {
			accessKeyId: process.env.ACCESS_KEY_ID || "",
			secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
		},
		region: process.env.REGION || "us-east-1",
	});
}

// Additional configuration for file size and type limits
const FILE_SIZE_LIMIT: number | null = 10 * 1024 * 1024; // Set as the maximum file size in bytes (10MB) or null for no limit
const FILE_TYPE_LIMITS: string[] | null = ["image/jpeg", "image/png", "image/gif"]; // Set as an array of allowed file types or null for no limit

/**
 * Handles the POST request to upload a file to an S3 bucket.
 *
 * @param {Request} req - The incoming request object. Expects a formData object with a "file" field.
 * @returns {Promise<NextResponse>} A promise that resolves with a NextResponse object. Returns a JSON response with either a success message and file URL or an error message.
 */
export const POST = async (req: Request) => {
	console.log(`[${new Date().toLocaleTimeString()}] Request to upload file received`);

	// Extracts the file from the request's form data.
	const formData = await req.formData();
	const file = formData.get("file") as File;

	// Validates that a file was received.
	if (!file) {
		return NextResponse.json({ error: "No files received." }, { status: 400 });
	}

	// Logs details about the received file.
	const { type, name, size } = file;
	const body = (await file.arrayBuffer()) as Buffer;
	console.log(`[${new Date().toLocaleTimeString()}] Received file: ${name} of type ${type} and size ${size}`);

	// If there's a file size limit configured, check if the file size is within the limit
	if (FILE_SIZE_LIMIT && size > FILE_SIZE_LIMIT) {
		// Return an error if the file size exceeds the limit
		return NextResponse.json(
			{ error: `File size exceeds ${FILE_SIZE_LIMIT / 1024 / 1024}MB limit.` },
			{ status: 400 }
		);
	}

	// If there are file type limits configured, check if the file type is allowed
	if (FILE_TYPE_LIMITS && FILE_TYPE_LIMITS.length > 0 && !FILE_TYPE_LIMITS.includes(type)) {
		// Return an error if the file type is not allowed
		return NextResponse.json(
			{ error: `File type not allowed. Allowed types: ${FILE_TYPE_LIMITS.join(", ")}` },
			{ status: 400 }
		);
	}

	// Prepares the file and metadata for upload to S3.
	const uploadParams = {
		Bucket: process.env.BUCKET_NAME || "your-bucket-name",
		Key: `${new Date().getTime()}-${name}`,
		Body: body,
		ContentType: type,
		ACL: "public-read" as ObjectCannedACL,
	};

	try {
		// Attempts to upload the file to S3.
		const data = await s3.send(new PutObjectCommand(uploadParams));
		console.log(`[${new Date().toLocaleTimeString()}] File uploaded successfully`);

		// Determine the service-specific URL part based on whether we're using DigitalOcean or AWS.
		const serviceUrlPart =
			storageService.toUpperCase() === "DIGITALOCEAN" ? "digitaloceanspaces.com" : "amazonaws.com";

		// Construct the subdomain part which is different for CDN usage in DigitalOcean compared to AWS's standard 's3' subdomain.
		const serviceSubdomain = storageService.toUpperCase() === "DIGITALOCEAN" ? "cdn" : "s3";

		// Construct the base domain using environment variables and fallbacks based on the storage service.
		// This setup supports custom domains via the DOMAIN environment variable. If not provided,
		// it defaults to a constructed domain based on whether AWS S3 or DigitalOcean Spaces is being used.
		const baseDomain =
			process.env.DOMAIN ||
			`${uploadParams.Bucket}.${process.env.REGION || "us-east-1"}.${serviceSubdomain}.${serviceUrlPart}`;

		// Responds with the URL of the uploaded file.
		return NextResponse.json(
			{
				success: true,
				message: "File uploaded successfully.",
				src: `https://${baseDomain}/${uploadParams.Key}`,
			},
			{
				status: 201,
			}
		);
	} catch (err) {
		// Return upload error
		console.error(`[${new Date().toLocaleTimeString()}] Error uploading file: ${err}`);
		return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
	}
};
