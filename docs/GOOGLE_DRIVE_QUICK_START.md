# Google Drive Integration - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Get Google Service Account Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Drive API**
4. Create a **Service Account**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name it (e.g., "dbroyal-drive-service")
   - Click "Create and Continue" > "Done"
5. Create a **JSON Key**:
   - Click on the service account email
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key" > "JSON"
   - Download the file

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Open the downloaded JSON file
3. Copy these values to your `.env`:

```bash
# From the JSON file
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
```

⚠️ **Important:** Keep the quotes and `\n` characters in the private key!

### Step 3: Share Your Google Drive Folder

1. Open your Google Drive folder
2. Click "Share"
3. Paste your service account email (from Step 2)
4. Set permission to "Viewer"
5. Uncheck "Notify people"
6. Click "Share"

### Step 4: Test It Out

```bash
# 1. Start your server
npm run start:dev

# 2. Create an event with Google Drive URL
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Event",
    "slug": "test-event",
    "category": "WEDDING",
    "googleDriveUrl": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
  }'

# 3. Get the event ID from response, then fetch images
curl http://localhost:3000/events/YOUR_EVENT_ID/google-drive-images
```

## 📋 API Quick Reference

### Create Event with Google Drive

```http
POST /events
{
  "name": "Event Name",
  "slug": "event-slug",
  "category": "WEDDING",
  "googleDriveUrl": "https://drive.google.com/drive/folders/FOLDER_ID"
}
```

### Get Images from Google Drive

```http
GET /events/:eventId/google-drive-images
```

### Sync Images to Database

```http
POST /events/:eventId/sync-google-drive
```

### Create Shareable Link

```http
POST /events/:eventId/create-shareable-link
{
  "photoIds": ["photo1", "photo2"]
}
```

## 🔍 Finding Your Folder ID

Your Google Drive URL looks like:

```
https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ
                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                        This is your FOLDER_ID
```

## ❗ Common Issues

| Issue                      | Solution                                                |
| -------------------------- | ------------------------------------------------------- |
| "Failed to fetch images"   | Share the folder with service account email             |
| "Invalid credentials"      | Check that `\n` characters are preserved in private key |
| "Invalid Google Drive URL" | Use format: `https://drive.google.com/drive/folders/ID` |

## 📚 Full Documentation

- [Complete Setup Guide](./GOOGLE_DRIVE_SETUP.md)
- [API Documentation](./GOOGLE_DRIVE_API.md)

## 🎯 Use Cases

### 1. **Display Event Gallery**

- Admin adds Google Drive URL to event
- Frontend calls `/events/:id/google-drive-images`
- Display thumbnails in a gallery

### 2. **User Downloads Selected Photos**

- User selects specific images
- Call `/events/:id/create-shareable-link` with selected photo IDs
- User gets a Google Drive folder with only selected images

### 3. **Cache Photos**

- Call `/events/:id/sync-google-drive`
- Images are stored in database
- Faster access, works offline

## 🔒 Security Notes

- Never commit `.env` file
- Service account only needs "Viewer" permission
- Shareable links are public (anyone with link can access)
- Keep JSON key file secure

## 🆘 Need Help?

1. Check logs for detailed error messages
2. Verify service account email is correct
3. Ensure folder is shared with service account
4. See [Full Setup Guide](./GOOGLE_DRIVE_SETUP.md) for troubleshooting
