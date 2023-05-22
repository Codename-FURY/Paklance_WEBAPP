const Profile = require("../Models/ProfileModel");
const sharp = require("sharp"); // Required for image resizing

const uploadProfilePicture = async (req, res, next) => {
  try {
    const userId = req.userId;
    const profilePic = req.file;

    // Construct the full path URL
    const baseUrl = `http://localhost:7000/profile-pictures/${profilePic.filename}`;

    // Resize the image
    const resizedImage = await sharp(profilePic.path)
      .resize(200) // Adjust the desired size as per your requirement
      .toBuffer();

    // Save the resized image with the correct filename
    const resizedFilename = `resized-${profilePic.filename}`;
    await sharp(resizedImage).toFile(`public/profile-pictures/${resizedFilename}`);

    // Update the profile record with the resized image URL and position adjustment
    await Profile.findOneAndUpdate(
      { userId },
      {
        profilePic: baseUrl,
        profilePicPosition: "opposite", // Adjust the position as per your requirement
        profilePicSize: "small" // Adjust the size as per your requirement
      },
      { new: true }
    );

    res.json({ message: 'Profile picture uploaded successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadProfilePicture
};
