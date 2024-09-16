
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pictures'); // Set the destination folder for profile pictures
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${extension}`); // Set the file name for the profile picture
  },
});

const upload = multer({ storage });

// Handle profile picture upload
router.post('/profile-picture', upload.single('profilePicture'), (req, res) => {
  // Access the uploaded file details using req.file
  // Store the file information in the database or upload it to a cloud storage service
  // Update the user's profile with the profile picture URL or other relevant information

  res.status(200).json({ message: 'Profile picture uploaded successfully' });
});

// Handle profile update
router.post('/', (req, res) => {
  const { name } = req.body;
  // Update the user's profile with the new information

  res.status(200).json({ message: 'Profile updated successfully' });
});

module.exports = router;

