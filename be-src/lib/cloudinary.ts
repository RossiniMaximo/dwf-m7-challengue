const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dqjrcykr7",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: "poSSJ1j1MCm9u8iXdkHD1v3ebeo",
});

export { cloudinary };
