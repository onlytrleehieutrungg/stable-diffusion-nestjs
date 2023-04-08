import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { GenerateImageDto } from './generate-image.dto';
import { getDataFolderpath, persistData } from '../utils/file.utils';
import { config } from 'src/config/config';
import * as fs from 'fs';
import sharp from 'sharp';
import FormData = require('form-data');
@Injectable()
export class StableDiffusionIntegrationService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(body: GenerateImageDto) {
    const apiKey = config.API_KEY;
    // const image = Buffer.from(body.image, 'binary');
    const engineId = 'stable-diffusion-v1-5';
    const formData = new FormData();
    // const image = sharp(body.image).png().toBuffer();
    formData.append(
      'init_image',
      fs.readFileSync('src/stable-diffusion-integration/init_image2.png'),
    );
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', 0.35);
    formData.append('text_prompts[0][text]', body.prompt);
    formData.append('cfg_scale', 7);
    formData.append('clip_guidance_preset', 'FAST_BLUE');
    formData.append('samples', 1);
    formData.append('steps', 30);
    const headers = {
      ...formData.getHeaders(),
      Accept: 'application/json',
      Authorization: apiKey,
    };
    const url = `https://api.stability.ai/v1/generation/${engineId}/image-to-image`;
    try {
      const response = await this.httpService.post(url, formData, { headers });

      const data = await lastValueFrom(response);
      const res = data?.data;
      return res;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.response.data, error.response.status);
    }
  }
}
