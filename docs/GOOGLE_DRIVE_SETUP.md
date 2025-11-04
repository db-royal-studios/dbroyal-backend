# Google Drive Integration Setup Guide

This guide walks you through setting up Google Drive API access for the photography management backend.

## Overview

The application uses a **Google Service Account** to access Google Drive folders and retrieve images. This allows the backend to:

- Display images from a Google Drive folder
- Allow users to select specific images
- Create shareable links for selected images
- Download images directly

## Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "DBRoyal Photography Backend")
5. Click **"Create"**

### Step 2: Enable Google Drive API

1. In your Google Cloud Console, select your project
2. Go to **"APIs & Services"** > **"Library"**
3. Search for **"Google Drive API"**
4. Click on it and click **"Enable"**

### Step 3: Create a Service Account

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"Service Account"**
3. Fill in the service account details:
   - **Service account name**: `dbroyal-drive-service`
   - **Service account ID**: (auto-generated)
   - **Description**: "Service account for accessing Google Drive folders"
4. Click **"Create and Continue"**
5. For the role, select **"Basic"** > **"Viewer"** (or skip this step)
6. Click **"Continue"** and then **"Done"**

### Step 4: Create and Download Service Account Key

1. In the **"Credentials"** page, find your newly created service account
2. Click on the service account email
3. Go to the **"Keys"** tab
4. Click **"Add Key"** > **"Create new key"**
5. Choose **"JSON"** format
6. Click **"Create"**
7. The JSON key file will be downloaded to your computer

### Step 5: Extract Credentials from JSON File

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "dbroyal-drive-service@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

You need:

- `client_email` - This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` - This is your `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

### Step 6: Update Your .env File

1. Copy the `.env.example` to `.env` if you haven't already:

   ```bash
   cp .env.example .env
   ```

2. Update the Google Drive credentials in your `.env` file:
   ```bash
   GOOGLE_SERVICE_ACCOUNT_EMAIL=dbroyal-drive-service@your-project.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-actual-private-key-here\n-----END PRIVATE KEY-----\n"
   ```

**Important Notes:**

- Keep the private key in quotes
- Ensure `\n` characters are preserved (they represent newlines)
- Never commit the `.env` file to version control
- Keep the JSON key file secure and private

### Step 7: Share Google Drive Folders with Service Account

For each Google Drive folder you want the backend to access:

1. Open the folder in Google Drive
2. Click **"Share"** (top right)
3. Paste the service account email (e.g., `dbroyal-drive-service@your-project.iam.gserviceaccount.com`)
4. Set permission to **"Viewer"**
5. Uncheck **"Notify people"** (service accounts don't need notifications)
6. Click **"Share"**

### Step 8: Test the Integration

1. Start your backend server:

   ```bash
   npm run start:dev
   ```

2. Create an event with a Google Drive folder URL:

   ```bash
   curl -X POST http://localhost:3000/events \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Event",
       "slug": "test-event",
       "category": "WEDDING",
       "googleDriveUrl": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
     }'
   ```

3. Fetch images from the Google Drive folder:
   ```bash
   curl http://localhost:3000/events/{eventId}/google-drive-images
   ```

## API Endpoints

### 1. Create Event with Google Drive URL

```http
POST /events
Content-Type: application/json

{
  "name": "Wedding Event",
  "slug": "wedding-2025",
  "category": "WEDDING",
  "googleDriveUrl": "https://drive.google.com/drive/folders/FOLDER_ID",
  "date": "2025-12-25",
  "location": "Lagos, Nigeria"
}
```

### 2. Get Images from Google Drive

```http
GET /events/{eventId}/google-drive-images
```

**Response:**

```json
{
  "eventId": "event123",
  "eventName": "Wedding Event",
  "googleDriveUrl": "https://drive.google.com/drive/folders/FOLDER_ID",
  "totalImages": 150,
  "images": [
    {
      "id": "file123",
      "name": "IMG_001.jpg",
      "webViewLink": "https://drive.google.com/file/d/file123/view",
      "thumbnailLink": "https://lh3.googleusercontent.com/...",
      "downloadLink": "https://drive.google.com/uc?export=download&id=file123"
    }
  ]
}
```

### 3. Sync Photos to Database

```http
POST /events/{eventId}/sync-google-drive
```

This endpoint fetches images from Google Drive and stores them in your database.

### 4. Create Shareable Link for Selected Photos

```http
POST /events/{eventId}/create-shareable-link
Content-Type: application/json

{
  "photoIds": ["photo1", "photo2", "photo3"]
}
```

**Response:**

```json
{
  "shareableLink": "https://drive.google.com/drive/folders/NEW_FOLDER_ID"
}
```

This creates a new folder with only the selected photos and returns a public shareable link.

## Troubleshooting

### Error: "Failed to fetch images from Google Drive"

**Possible causes:**

1. Service account doesn't have access to the folder
   - **Solution**: Share the folder with the service account email
2. Invalid Google Drive URL
   - **Solution**: Ensure the URL is in format: `https://drive.google.com/drive/folders/FOLDER_ID`
3. API not enabled
   - **Solution**: Enable Google Drive API in Google Cloud Console

### Error: "Invalid credentials"

**Possible causes:**

1. Private key not formatted correctly
   - **Solution**: Ensure `\n` characters are preserved in the private key
2. Wrong service account email
   - **Solution**: Double-check the email from your JSON key file

### Error: "Quota exceeded"

**Possible causes:**

1. Too many API requests
   - **Solution**: Google Drive API has quota limits. Check your quota in Google Cloud Console

## Security Best Practices

1. **Never commit credentials**: Always use `.env` file and add it to `.gitignore`
2. **Rotate keys regularly**: Create new service account keys periodically
3. **Limit permissions**: Only grant "Viewer" access to necessary folders
4. **Monitor usage**: Check Google Cloud Console for unusual activity
5. **Use separate service accounts**: Consider using different service accounts for development and production

## Additional Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [Service Accounts Overview](https://cloud.google.com/iam/docs/service-accounts)
- [Google Drive API Quotas](https://developers.google.com/drive/api/guides/limits)

## Support

If you encounter issues not covered in this guide, please:

1. Check the application logs for detailed error messages
2. Verify all credentials are correct
3. Ensure the Google Drive folder is shared with the service account
4. Contact the development team with specific error messages
