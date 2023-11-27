// image-upload.service.ts
import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';

@Injectable()
export class ImageUploadService {
  async uploadBase64Image(base64: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`);
      return result.url;
    } catch (error) {
      throw new Error(`Erreur lors du téléchargement de l'image: ${error.message}`);
    }
  }
}
