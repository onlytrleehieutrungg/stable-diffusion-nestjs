import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerateImageDto } from './generate-image.dto';
import { StableDiffusionIntegrationService } from './stable-diffusion-integration.service';

@Controller('stable-diffusion-integration')
export class StableDiffusionIntegrationController {
  constructor(private readonly service: StableDiffusionIntegrationService) {}

  @Post()
  async generateImage(@Body() data: GenerateImageDto) {
    return this.service.generateImage(data);
  }
}
