import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const ASSETS_FOLDER_NAME = 'stable-diffusion-api-images';
const createFolderIfNotExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

export const getDataFolderpath = () => {
  const result = path.resolve(os.tmpdir(), ASSETS_FOLDER_NAME);
  createFolderIfNotExists(result);
  return result;
};

export const persistData = (data: any, localFilePath: string) => {
  fs.writeFileSync(localFilePath, data);
};
