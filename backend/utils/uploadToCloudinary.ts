import cloudinary from "./cloudinary";

export const uploadBufferToCloudinary = (buffer: Buffer, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `kyc/${filename}-${Date.now()}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};
