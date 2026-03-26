import multer from "multer";
import path from "path";

const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/mp4",
  "audio/aac",
  "audio/flac",
  "audio/x-m4a",
];

const ALLOWED_EXTENSIONS = [".mp3", ".wav", ".ogg", ".webm", ".m4a", ".aac", ".flac"];

// Disk storage for backward compatibility with existing endpoints
const diskStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

// Memory storage for privacy-first audio processing
// Privacy: audio is kept in memory only and never persisted to disk
const memoryStorage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeTypeAllowed = ALLOWED_AUDIO_TYPES.includes(file.mimetype);
  const isExtensionAllowed = ALLOWED_EXTENSIONS.includes(ext);

  // Accept if either MIME type or extension matches
  if (isMimeTypeAllowed || isExtensionAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}. Got: ${ext || file.mimetype}`
      ),
      false
    );
  }
};

// Default disk storage upload (for backward compatibility)
const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Memory storage upload for privacy-first processing
// Privacy: audio is processed and immediately discarded
export const uploadMemory = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
