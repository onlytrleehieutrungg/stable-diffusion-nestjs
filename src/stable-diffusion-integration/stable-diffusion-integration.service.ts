import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { GenerateImageDto } from './generate-image.dto';
import { getDataFolderpath, persistData } from '../utils/file.utils';
import { config } from 'src/config/config';
@Injectable()
export class StableDiffusionIntegrationService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(generateImage: GenerateImageDto) {
    const apiKey = config.API_KEY;
    // if (!apiKey) throw new Error('Missing Stability API key.');
    // console.log(apiKey);

    const engineId = 'stable-diffusion-v1-5';
    const apiHost = 'https://api.stability.ai';
    const result = await this.httpService.post(
      `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
      {
        cfg_scale: 7,
        clip_guidance_preset: 'FAST_BLUE',
        // height: generateImage.imageHeight,
        // width: generateImage.imageWidth,
        // samples: 1,
        // steps: generateImage.steps,
        // text_prompts: prompts,
        height: 512,
        width: 512,
        samples: 1,
        steps: 50,
        text_prompts: [
          {
            text: generateImage.prompt,
            weight: 1,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'image/png',
          Authorization: apiKey,
        },
        responseType: 'arraybuffer',
      },
    );

    const data = await lastValueFrom(result);
    // const filePath = `${getDataFolderpath()}/${Date.now()}.png`;
    // persistData(Buffer.from(data.data), filePath);
    console.log(data.data);
    return data.data;
  }
}
