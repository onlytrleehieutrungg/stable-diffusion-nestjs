import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { GenerateImageDto } from './generate-image.dto';
import { getDataFolderpath, persistData } from '../utils/file.utils';
import { config } from 'src/config/config';
import * as fs from 'fs';
import FormData = require('form-data');
@Injectable()
export class StableDiffusionIntegrationService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(body: GenerateImageDto) {
    const apiKey = config.API_KEY;
    // if (!apiKey) throw new Error('Missing Stability API key.');
    // console.log(apiKey);

    const image = Buffer.from(body.image, 'binary');
    // const image = fs.readFileSync(
    //   'src/stable-diffusion-integration/init_image.png',
    // );
    // console.log('image', image);
    const engineId = 'stable-diffusion-v1-5';
    const imageStrength = 0.35;
    const apiHost = 'https://api.stability.ai';
    const formData = new FormData();
    formData.append('init_image', image);
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', '0.35');
    formData.append('text_prompts[0][text]', body.prompt);
    formData.append('cfg_scale', '7');
    formData.append('clip_guidance_preset', 'FAST_BLUE');
    formData.append('samples', '1');
    formData.append('steps', '30');
    const result = await this.httpService
      .post(
        `https://api.stability.ai/v1/generation/${engineId}/image-to-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
            Authorization: apiKey,
          },
          responseType: 'arraybuffer',
        },
      )
      .pipe(
        map((res) => res.data),
        catchError((e) => {
          console.log(e.message);
          throw new HttpException(e.response.data, e.response.status);
        }),
      );

    const data = await lastValueFrom(result);
    try {
      console.log('res', data);
    } catch (err) {
      console.log(err.message);
    }
    return data;
  }
}
