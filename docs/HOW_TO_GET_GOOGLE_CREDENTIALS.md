# How to Obtain Google Drive API Credentials - Step-by-Step Guide

This guide will walk you through obtaining the credentials needed for Google Drive integration.

## What You Need

By the end of this guide, you'll have:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Your service account email
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` - Your service account private key

## Step-by-Step Process

### Step 1: Access Google Cloud Console

1. Open your browser and go to: **https://console.cloud.google.com/**
2. Sign in with your Google account
3. If prompted, accept the terms of service

---

### Step 2: Create a New Project

1. Look at the top left of the page, next to "Google Cloud"
2. Click on the **project dropdown** (it might say "Select a project" or show an existing project name)
3. In the popup window, click **"NEW PROJECT"** (top right)
4. Fill in the project details:
   - **Project name**: `DBRoyal Photography` (or any name you prefer)
   - **Organization**: Leave as default or select your organization
   - **Location**: Leave as default
5. Click **"CREATE"**
6. Wait a few seconds for the project to be created
7. Click **"SELECT PROJECT"** when it appears

![Create Project](https://cloud.google.com/static/docs/images/console-create-project.png)

---

### Step 3: Enable Google Drive API

1. In the left sidebar, click on **"APIs & Services"** → **"Library"**
   - Or use the search bar at the top and search for "API Library"
2. In the API Library, search for **"Google Drive API"**
3. Click on **"Google Drive API"** from the results
4. Click the blue **"ENABLE"** button
5. Wait for the API to be enabled (takes a few seconds)

![Enable API](https://developers.google.com/drive/api/images/enable-drive-api.png)

---

### Step 4: Create a Service Account

1. In the left sidebar, click on **"APIs & Services"** → **"Credentials"**
2. At the top, click **"+ CREATE CREDENTIALS"**
3. Select **"Service account"** from the dropdown

![Create Credentials](https://cloud.google.com/iam/docs/images/create-service-account.png)

---

### Step 5: Configure Service Account Details

1. Fill in the service account details:
   - **Service account name**: `dbroyal-drive-service` (or any name you prefer)
   - **Service account ID**: Will be auto-filled based on the name
   - **Service account description**: `Service account for accessing Google Drive folders`
2. Click **"CREATE AND CONTINUE"**

3. On the "Grant this service account access to project" page:

   - **Select a role**: You can skip this or select **"Basic"** → **"Viewer"**
   - Click **"CONTINUE"**

4. On the "Grant users access to this service account" page:
   - You can skip this step
   - Click **"DONE"**

---

### Step 6: Create and Download the JSON Key

1. You'll be back on the **"Credentials"** page
2. Scroll down to the **"Service Accounts"** section
3. Find your newly created service account (e.g., `dbroyal-drive-service@your-project.iam.gserviceaccount.com`)
4. Click on the **service account email** (it's a link)

5. You're now on the service account details page
6. Click on the **"KEYS"** tab at the top
7. Click **"ADD KEY"** → **"Create new key"**

![Add Key](https://cloud.google.com/iam/docs/images/create-key.png)

8. Select **"JSON"** as the key type
9. Click **"CREATE"**

10. A JSON file will automatically download to your computer
    - The file name will be something like: `your-project-name-abc123.json`
    - **Keep this file secure!** It contains sensitive credentials

---

### Step 7: Extract Credentials from the JSON File

1. Open the downloaded JSON file in a text editor (VS Code, Notepad, TextEdit, etc.)
2. The file will look like this:

```json
{
  "type": "service_account",
  "project_id": "dbroyal-photography-123456",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "dbroyal-drive-service@dbroyal-photography-123456.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

3. **Find these two values:**

   **Value 1: `client_email`**

   - This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Copy the entire email address
   - Example: `dbroyal-drive-service@dbroyal-photography-123456.iam.gserviceaccount.com`

   **Value 2: `private_key`**

   - This is your `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
   - Copy the entire value including the quotes and `\n` characters
   - Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"`
   - **Important:** Keep the `\n` characters - they represent line breaks

---

### Step 8: Add Credentials to Your .env File

1. In your project, open the `.env` file (or create it from `.env.example`)
2. Add the credentials:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=dbroyal-drive-service@dbroyal-photography-123456.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**

- Keep the private key in quotes: `"-----BEGIN PRIVATE KEY-----..."`
- Keep all `\n` characters in the private key
- Don't add extra spaces or line breaks
- The private key should be on one line in your `.env` file

---

### Step 9: Save the Service Account Email

**IMPORTANT:** Copy the service account email (from `client_email`) and save it somewhere safe. You'll need it to share Google Drive folders!

Example: `dbroyal-drive-service@dbroyal-photography-123456.iam.gserviceaccount.com`

---

### Step 10: Share Google Drive Folders

For each Google Drive folder you want to use with your app:

1. Open the folder in Google Drive (drive.google.com)
2. Click the **"Share"** button (top right)
3. In the "Add people and groups" field, paste your service account email
   - Example: `dbroyal-drive-service@dbroyal-photography-123456.iam.gserviceaccount.com`
4. Click on the permission dropdown and select **"Viewer"**
5. **UNCHECK** the "Notify people" checkbox (service accounts don't need notifications)
6. Click **"Share"**

![Share Folder](https://support.google.com/drive/answer/7166529)

---

## Verification Checklist

Before testing your integration, make sure:

- [ ] Google Drive API is enabled in your project
- [ ] Service account is created
- [ ] JSON key file is downloaded
- [ ] Service account email is copied to `.env` file
- [ ] Private key is copied to `.env` file (with quotes and `\n` characters)
- [ ] `.env` file is created in your project root
- [ ] Google Drive folders are shared with service account email
- [ ] Folder permission is set to "Viewer"

---

## Testing Your Setup

1. Start your backend server:

   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

2. Create a test event with a Google Drive URL:

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

3. Get the event ID from the response, then fetch images:

   ```bash
   curl http://localhost:3000/events/YOUR_EVENT_ID/google-drive-images
   ```

4. If you see a list of images, **congratulations!** Your setup is working! 🎉

---

## Common Issues and Solutions

### Issue 1: "Failed to fetch images from Google Drive"

**Problem:** Service account doesn't have access to the folder

**Solution:**

1. Go to your Google Drive folder
2. Check if the service account email is in the "People with access" list
3. If not, share the folder with the service account email
4. Make sure permission is set to "Viewer"

---

### Issue 2: "Invalid credentials"

**Problem:** Private key is not formatted correctly

**Solution:**

1. Open your `.env` file
2. Make sure the private key:
   - Is surrounded by quotes: `"-----BEGIN PRIVATE KEY-----..."`
   - Contains `\n` characters (not actual line breaks)
   - Is all on one line
3. Copy the private key directly from the JSON file without modification

---

### Issue 3: "API not enabled"

**Problem:** Google Drive API is not enabled for your project

**Solution:**

1. Go to Google Cloud Console
2. Navigate to "APIs & Services" → "Library"
3. Search for "Google Drive API"
4. Click "Enable"

---

### Issue 4: "Quota exceeded"

**Problem:** Too many API requests

**Solution:**

1. Go to Google Cloud Console
2. Navigate to "APIs & Services" → "Dashboard"
3. Check your quota usage
4. Wait for the quota to reset (usually daily)
5. Consider implementing caching in your app

---

## Security Best Practices

1. **Never commit credentials:**

   - Add `.env` to your `.gitignore`
   - Never share your JSON key file publicly

2. **Store the JSON key file securely:**

   - Keep it in a secure location
   - Don't upload it to GitHub or any public place
   - Consider using a password manager

3. **Use minimum permissions:**

   - Only grant "Viewer" permission to the service account
   - Don't give "Editor" or "Owner" access

4. **Rotate keys regularly:**

   - Create new keys periodically
   - Delete old keys after rotation

5. **Monitor usage:**
   - Check Google Cloud Console regularly
   - Look for unusual activity
   - Set up alerts for high usage

---

## Need Help?

If you're stuck or encounter issues:

1. **Check the logs:**

   - Look at your backend server logs for detailed error messages

2. **Review the documentation:**

   - See `GOOGLE_DRIVE_SETUP.md` for detailed troubleshooting
   - See `GOOGLE_DRIVE_API.md` for API documentation

3. **Verify credentials:**

   - Double-check your `.env` file
   - Make sure there are no extra spaces or line breaks

4. **Test with Google Drive API:**
   - Try accessing the folder directly in Google Drive
   - Make sure the folder exists and contains images

---

## What's Next?

After setting up your credentials:

1. **Test the integration** - Create events and fetch images
2. **Read the API documentation** - See `GOOGLE_DRIVE_API.md`
3. **Implement the frontend** - Display images in your UI
4. **Share with your team** - Make sure everyone knows how to use it

---

## Quick Reference

### What Goes in .env?

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
```

### Where to Find Values?

- **Email:** `client_email` in JSON file
- **Private Key:** `private_key` in JSON file (keep quotes and `\n`)

### How to Share Folders?

1. Open folder in Google Drive
2. Click "Share"
3. Add service account email
4. Set permission to "Viewer"
5. Uncheck "Notify people"
6. Click "Share"

---

**That's it!** You now have Google Drive API credentials configured for your photography backend. 🎉
