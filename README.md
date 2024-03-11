# Image Uploader Component for Next.js

This Image Uploader component allows easy integration of image uploading capabilities into your Next.js projects, with support for AWS S3 and DigitalOcean Spaces. It comes with a simple yet powerful API route setup for handling uploads and supports custom domains for both storage services.

## How to Use

### 1. Integration into Your Project

-   Copy the `ImageUploader` component into your project's component directory.
-   Copy the `/api/upload` route into your project's pages/api directory.
-   This example uses Tailwind CSS for styling and leverages Next.js's API routes for backend logic.

### 2. Install Dependencies

Install the necessary dependencies by running:

```bash
npm install @aws-sdk/client-s3 aws-sdk
```

or

```bash
yarn add @aws-sdk/client-s3 aws-sdk
```

### 3. Configuration

Configure your project to use AWS S3 or DigitalOcean Spaces by filling in the `.env.local` file. Here are the variables you need to set:

```plaintext
# AWS S3 or DigitalOcean Spaces credentials
ACCESS_KEY_ID=your_access_key_id
SECRET_ACCESS_KEY=your_secret_access_key

# Bucket configuration
REGION=your_region # e.g., us-east-1 for AWS, nyc3 for DigitalOcean
BUCKET_NAME=your_bucket_name

# Optional custom domain for accessing uploaded files
DOMAIN=your_custom_domain

# Storage service configuration
STORAGE_SERVICE=AWS # or DIGITALOCEAN
SPACES_ENDPOINT=your_spaces_endpoint # Required if using DigitalOcean, e.g., nyc3.digitaloceanspaces.com
```

### 4. Coming Soon

Better docs on how to set up your buckets and the best setup practices for both AWS and DigitalOcean will be provided in future updates.

### 5. Features Coming Soon

-   Multi-image upload: Enhancements to support uploading multiple images simultaneously.
-   Pre-styled component: A version of the ImageUploader component that comes with predefined styles.

### 6. License

This project is open-sourced under the MIT license. Feel free to use, modify, and distribute it as you see fit.

```

```
