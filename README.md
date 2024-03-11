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

Configure your project to use either AWS S3 or DigitalOcean Spaces by filling in the `.env.local` file with the appropriate values:

# .env.local example configuration

ACCESS_KEY_ID=DO004HGAJTLNNM92T678
SECRET_ACCESS_KEY=Rqaf0RUX6oG+rmFS3GVvUEJP0dBcDm34eRjPoaVT0R8
REGION=nyc3
BUCKET_NAME=bucket-name
DOMAIN= # Optional, set this if you're using a custom domain
STORAGE_SERVICE=DIGITALOCEAN # Use AWS or DO depending on your service
SPACES_ENDPOINT=nyc3.digitaloceanspaces.com # Required if using DigitalOcean

Ensure you replace the placeholder values with your actual credentials and configurations.

### 4. Coming Soon

Better docs on how to set up your buckets and the best setup practices for both AWS and DigitalOcean will be provided in future updates.

### 5. Features Coming Soon

-   Multi-image upload: Enhancements to support uploading multiple images simultaneously.
-   Pre-styled component: A version of the ImageUploader component that comes with predefined styles.

### 6. License

This project is open-sourced under the MIT license. Feel free to use, modify, and distribute it as you see fit.
