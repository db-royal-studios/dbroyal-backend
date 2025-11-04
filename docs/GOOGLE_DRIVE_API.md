# Google Drive Integration API Documentation

## Overview

The Google Drive integration allows admins to link Google Drive folders to events, display images, and enable users to select and download specific images.

## Workflow

```
1. Admin creates event with Google Drive URL
   ↓
2. System fetches images from Google Drive folder
   ↓
3. Users can view thumbnails and full images
   ↓
4. Users select specific images
   ↓
5. System creates shareable link or allows direct download
```

## API Endpoints

### 1. Create Event with Google Drive URL

**Endpoint:** `POST /events`

**Description:** Create a new event and optionally link it to a Google Drive folder.

**Request Body:**

```json
{
  "name": "John & Jane Wedding",
  "slug": "john-jane-wedding-2025",
  "category": "WEDDING",
  "description": "Beautiful wedding ceremony in Lagos",
  "date": "2025-12-25T14:00:00Z",
  "location": "Lagos, Nigeria",
  "coverImageUrl": "https://example.com/cover.jpg",
  "googleDriveUrl": "https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j",
  "clientId": "client123"
}
```

**Required Fields:**

- `name` (string): Event name
- `slug` (string): URL-friendly identifier
- `category` (enum): WEDDING, CORPORATE, PHOTOSHOOT, BIRTHDAY, BURIAL, OTHER

**Optional Fields:**

- `description` (string): Event description
- `date` (ISO 8601 date): Event date
- `location` (string): Event location
- `coverImageUrl` (string): Cover image URL
- `googleDriveUrl` (string): Google Drive folder URL
- `clientId` (string): Associated client ID

**Response:**

```json
{
  "id": "evt_123abc",
  "name": "John & Jane Wedding",
  "slug": "john-jane-wedding-2025",
  "category": "WEDDING",
  "description": "Beautiful wedding ceremony in Lagos",
  "date": "2025-12-25T14:00:00Z",
  "location": "Lagos, Nigeria",
  "coverImageUrl": "https://example.com/cover.jpg",
  "googleDriveUrl": "https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j",
  "country": "NG",
  "createdAt": "2025-11-04T10:00:00Z",
  "updatedAt": "2025-11-04T10:00:00Z"
}
```

---

### 2. Update Event (Add/Change Google Drive URL)

**Endpoint:** `PATCH /events/:id`

**Description:** Update event details, including adding or changing the Google Drive URL.

**Request Body:**

```json
{
  "googleDriveUrl": "https://drive.google.com/drive/folders/NEW_FOLDER_ID"
}
```

**Response:**

```json
{
  "id": "evt_123abc",
  "name": "John & Jane Wedding",
  "googleDriveUrl": "https://drive.google.com/drive/folders/NEW_FOLDER_ID",
  "updatedAt": "2025-11-04T11:00:00Z"
}
```

---

### 3. Get Google Drive Images

**Endpoint:** `GET /events/:id/google-drive-images`

**Description:** Fetch all images from the Google Drive folder linked to this event. This does NOT store images in the database.

**Parameters:**

- `id` (path): Event ID

**Response:**

```json
{
  "eventId": "evt_123abc",
  "eventName": "John & Jane Wedding",
  "googleDriveUrl": "https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j",
  "totalImages": 247,
  "images": [
    {
      "id": "1aBcDeFgHiJkLmNoPqRsTuVwXyZ",
      "name": "IMG_0001.jpg",
      "webViewLink": "https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view",
      "thumbnailLink": "https://lh3.googleusercontent.com/...",
      "downloadLink": "https://drive.google.com/uc?export=download&id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
    },
    {
      "id": "2bCdEfGhIjKlMnOpQrStUvWxYz",
      "name": "IMG_0002.jpg",
      "webViewLink": "https://drive.google.com/file/d/2bCdEfGhIjKlMnOpQrStUvWxYz/view",
      "thumbnailLink": "https://lh3.googleusercontent.com/...",
      "downloadLink": "https://drive.google.com/uc?export=download&id=2bCdEfGhIjKlMnOpQrStUvWxYz"
    }
  ]
}
```

**Image Object Fields:**

- `id`: Google Drive file ID
- `name`: Original filename
- `webViewLink`: Link to view in Google Drive
- `thumbnailLink`: Link to thumbnail image (lower resolution)
- `downloadLink`: Direct download link

---

### 4. Sync Photos to Database

**Endpoint:** `POST /events/:id/sync-google-drive`

**Description:** Fetch images from Google Drive and store them in the database. This is useful for caching or when you want to track which photos belong to which event.

**Parameters:**

- `id` (path): Event ID

**Response:**

```json
{
  "synced": 247,
  "photos": [
    {
      "id": "1aBcDeFgHiJkLmNoPqRsTuVwXyZ",
      "name": "IMG_0001.jpg",
      "webViewLink": "https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/view",
      "thumbnailLink": "https://lh3.googleusercontent.com/...",
      "downloadLink": "https://drive.google.com/uc?export=download&id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
    }
  ]
}
```

**Notes:**

- This deletes all existing photos for the event and replaces them with the current Google Drive contents
- Use this endpoint when you want to refresh the photo list from Google Drive

---

### 5. Create Shareable Link for Selected Photos

**Endpoint:** `POST /events/:id/create-shareable-link`

**Description:** Create a new Google Drive folder containing only the selected photos and return a shareable link. This is useful when users want to download multiple specific images.

**Parameters:**

- `id` (path): Event ID

**Request Body:**

```json
{
  "photoIds": ["photo_abc123", "photo_def456", "photo_ghi789"]
}
```

**Response:**

```json
{
  "shareableLink": "https://drive.google.com/drive/folders/3cDeFgHiJkLmNoPqRsTuVwXyZ"
}
```

**Notes:**

- Creates a new folder in the service account's Google Drive
- Copies the selected photos to this new folder
- Makes the folder publicly accessible (anyone with the link can view)
- The folder name includes a timestamp

---

### 6. Get Event Photos (from Database)

**Endpoint:** `GET /events/:id/photos`

**Description:** Get all photos stored in the database for this event (only works if you've synced photos using the sync endpoint).

**Parameters:**

- `id` (path): Event ID

**Response:**

```json
[
  {
    "id": "photo_abc123",
    "eventId": "evt_123abc",
    "url": "https://lh3.googleusercontent.com/...",
    "caption": "IMG_0001.jpg",
    "status": "COMPLETE",
    "uploadedById": null,
    "createdAt": "2025-11-04T10:00:00Z"
  }
]
```

---

## Usage Examples

### Example 1: Complete Workflow for Admin

```bash
# 1. Create event with Google Drive URL
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Birthday Party",
    "slug": "sarah-birthday-2025",
    "category": "BIRTHDAY",
    "googleDriveUrl": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
  }'

# Response: { "id": "evt_xyz789", ... }

# 2. Fetch images from Google Drive (display to users)
curl http://localhost:3000/events/evt_xyz789/google-drive-images

# 3. Optionally sync to database for caching
curl -X POST http://localhost:3000/events/evt_xyz789/sync-google-drive
```

### Example 2: User Selects and Downloads Photos

```bash
# 1. User views images
curl http://localhost:3000/events/evt_xyz789/google-drive-images

# 2. User selects specific images and creates shareable link
curl -X POST http://localhost:3000/events/evt_xyz789/create-shareable-link \
  -H "Content-Type: application/json" \
  -d '{
    "photoIds": ["photo_1", "photo_2", "photo_3"]
  }'

# Response: { "shareableLink": "https://drive.google.com/drive/folders/..." }

# 3. User can visit the shareable link to download all selected photos
```

### Example 3: Frontend Integration (React/Next.js)

```typescript
// Fetch and display Google Drive images
async function loadEventImages(eventId: string) {
  const response = await fetch(`/api/events/${eventId}/google-drive-images`);
  const data = await response.json();

  return data.images.map((img) => ({
    id: img.id,
    thumbnail: img.thumbnailLink,
    download: img.downloadLink,
    name: img.name,
  }));
}

// Create shareable link for selected images
async function createShareableLink(eventId: string, selectedIds: string[]) {
  // First, get the database photo IDs that correspond to the Google Drive IDs
  const response = await fetch(`/api/events/${eventId}/photos`);
  const photos = await response.json();

  const photoIds = photos
    .filter((p) => selectedIds.includes(extractDriveId(p.url)))
    .map((p) => p.id);

  const result = await fetch(`/api/events/${eventId}/create-shareable-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ photoIds }),
  });

  return result.json();
}

function extractDriveId(url: string): string | null {
  const match = url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}
```

---

## Image URLs Explained

### Thumbnail Link

- **URL:** `https://lh3.googleusercontent.com/...`
- **Purpose:** Low-resolution preview image
- **Use case:** Display in galleries, thumbnails
- **Size:** Usually 200-400px wide
- **Loading:** Fast

### Download Link

- **URL:** `https://drive.google.com/uc?export=download&id={fileId}`
- **Purpose:** Direct download of full-resolution image
- **Use case:** When user wants to download the image
- **Size:** Original file size
- **Loading:** Slower (full resolution)

### Web View Link

- **URL:** `https://drive.google.com/file/d/{fileId}/view`
- **Purpose:** View image in Google Drive interface
- **Use case:** When you want users to view in Google Drive
- **Note:** Requires Google Drive UI

---

## Error Responses

### Missing Google Drive URL

```json
{
  "statusCode": 400,
  "message": "Event does not have a Google Drive URL configured",
  "error": "Bad Request"
}
```

### Invalid Google Drive URL

```json
{
  "statusCode": 400,
  "message": "Invalid Google Drive folder URL",
  "error": "Bad Request"
}
```

### Permission Denied

```json
{
  "statusCode": 500,
  "message": "Failed to fetch images from Google Drive. Ensure the folder is shared with the service account.",
  "error": "Internal Server Error"
}
```

**Solution:** Share the Google Drive folder with your service account email.

### No Photos Selected

```json
{
  "statusCode": 400,
  "message": "No valid Google Drive file IDs found in selected photos",
  "error": "Bad Request"
}
```

---

## Best Practices

### For Admins

1. **Share folders with service account BEFORE adding to events**

   - Share folder with service account email
   - Set permission to "Viewer"

2. **Use descriptive folder names**

   - Example: "John-Jane-Wedding-2025-Photos"

3. **Organize photos before linking**

   - Remove unwanted images
   - Rename files if needed

4. **Test the integration**
   - After creating event, call the `google-drive-images` endpoint
   - Verify images are returned

### For Frontend Developers

1. **Use thumbnail links for galleries**

   - Faster loading
   - Better user experience
   - Reduce bandwidth

2. **Implement lazy loading**

   - Load images as user scrolls
   - Improve initial page load time

3. **Cache image data**

   - Store image metadata locally
   - Reduce API calls

4. **Handle errors gracefully**
   - Show user-friendly messages
   - Provide retry options

### For Users

1. **Select multiple images efficiently**

   - Use shift+click for range selection
   - Use ctrl/cmd+click for individual selection

2. **Download options**
   - Single image: Use direct download link
   - Multiple images: Use shareable link feature

---

## Limitations

1. **Google Drive API Quotas**

   - 20,000 queries per 100 seconds per project
   - Monitor usage in Google Cloud Console

2. **File Size Limits**

   - Google Drive file size limits apply
   - Individual files up to 5TB

3. **Folder Depth**

   - Only images in the specified folder (not subfolders)
   - To include subfolders, create separate events

4. **Image Formats**
   - Supports: JPEG, PNG, GIF, BMP, WebP, SVG
   - Detected by MIME type containing 'image/'

---

## Security Considerations

1. **Service Account Access**

   - Only share necessary folders
   - Use "Viewer" permission (not "Editor")

2. **Public Links**

   - Shareable links are public (anyone with link can view)
   - Consider implementing expiration mechanism

3. **Rate Limiting**

   - Implement rate limiting on your endpoints
   - Prevent abuse of Google Drive API

4. **Input Validation**
   - Validate Google Drive URLs
   - Validate photo IDs before processing

---

## Testing Checklist

- [ ] Create event with Google Drive URL
- [ ] Fetch images from Google Drive
- [ ] Verify thumbnail links work
- [ ] Verify download links work
- [ ] Sync photos to database
- [ ] Create shareable link with selected photos
- [ ] Test with folder containing 0 images
- [ ] Test with folder containing 100+ images
- [ ] Test with invalid Google Drive URL
- [ ] Test with folder not shared with service account
- [ ] Test error handling and error messages
