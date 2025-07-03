// controllers/fileController.js

const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, filename, path, mimetype, size } = req.file;

    res.status(200).json({
      message: 'File uploaded successfully!',
      file: {
        originalname,
        filename,
        path,
        mimetype,
        size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { uploadFile };
