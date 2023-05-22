import { v2 as cloudinary } from 'cloudinary';

export class Cloudinary {
  constructor(config, logger) {
    this.logger = logger;
    this.config = config;
    this.options = {
      asset_folder: 'eatly_assets',
      use_filename: true,
    };
    cloudinary.config({
      cloud_name: config.cloudinary.cloudinaryName,
      api_key: config.cloudinary.cloudinaryApiKey,
      api_secret: config.cloudinary.cloudinaryApiSecret,
    });
  }

  /**
   * Upload image
   * @param imagePath
   * @returns UploadApiResponse
   */
  async uploadImage(imagePath) {
    try {
      const response = await cloudinary.uploader.upload(imagePath, this.options);
      this.logger.log('Image uploaded successfully');
      return response;
    } catch (error) {
      this.logger.error('Error occured while uploading an image to cloudinary', error);
      throw error;
    }
  };

    /**
    * Delete files from Cloudinary.
    * Expects an array of public_ids
    * @param {<array>} files 
    */
    async cloudinaryDelete(public_id) {
      try {
        return await cloudinary.api.delete_resources(public_id, {}, async (err, res) => {
            if (err) { 
                this.logger.error('Error occured while deleting image from cloudinary', err); 
                throw err; 
            }
            this.logger.log('Image deleted successfully.', res);
            return res;
        });
      } catch(error) {
        throw error;
      }
    }
}
