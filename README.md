# Digital PDF Backend

This is the backend for the Digital PDF application, providing RESTful APIs for user authentication, PDF upload, digital signing, and document management.

## Features

- User registration and login with JWT authentication
- Secure PDF upload and storage using Cloudinary
- Digital signing of PDFs with customizable styles
- Fetch, list, and delete signed PDF documents
- MongoDB integration for user and document data
- Input validation and error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB (via Mongoose)
- Cloudinary (file storage)
- Multer (file uploads)
- pdf-lib (PDF manipulation)
- JWT (authentication)
- express-validator (input validation)
- dotenv (environment variables)

## Project Structure

```
backend/
  cloudinary/         # Cloudinary config and upload helpers
  connectdb/          # MongoDB connection logic
  middleware/         # Express middleware (e.g., JWT verification)
  models/             # Mongoose models (User, Document)
  multer/             # Multer config for PDF uploads
  public/             # Uploaded files (temporary)
  routes/             # Express route handlers (auth, document)
  utils/              # Utility functions (e.g., Cloudinary public id)
  validators/         # Request validation rules
  .env                # Environment variables
  index.js            # Entry point
  package.json        # Dependencies and scripts
  README.md           # Project documentation
```

## Environment Variables

Create a `.env` file in the `backend/` directory with the following content:

```
PORT=4000
BACKEND_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:5173"
DATABASE_URL="your-mongodb-uri"
JWT_SECRET="your-jwt-secret"
CLOUD_NAME="your-cloudinary-cloud-name"
CLOUD_API_KEY="your-cloudinary-api-key"
CLOUD_API_SECRET="your-cloudinary-api-secret"
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database
- Cloudinary account

### Installation

1. Navigate to the `backend` directory:

   ```sh
   cd backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up your `.env` file as described above.

### Running the Server

Start the development server with nodemon:

```sh
npm run server
```

The backend will run at [http://localhost:4000](http://localhost:4000).

## API Endpoints

### Authentication

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT token
- `GET /auth/verify` — Verify JWT token
- `GET /auth/getUserDetails` — Get user details

### Document Management

- `POST /document/upload` — Upload and sign a PDF (requires JWT)
- `GET /document/getPdfFiles` — List user's PDF files (requires JWT)
- `DELETE /document/delete?id=...` — Delete a PDF by ID (requires JWT)

## Notes

- Uploaded files are stored temporarily in the `public/` folder and then uploaded to Cloudinary.
- All protected routes require the `Authorization: Bearer <token>` header.
- PDF signing uses the [pdf-lib](https://pdf-lib.js.org/) library.

## License

See [package.json](package.json) for license information.

---

© 2024 Digital PDF. All rights reserved.