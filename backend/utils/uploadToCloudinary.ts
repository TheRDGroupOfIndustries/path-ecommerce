import cloudinary from "./cloudinary.js";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  filename: string,
  folder: string //  new param
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `${folder}/${filename}-${Date.now()}`, //  dynamic folder
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result!.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};
