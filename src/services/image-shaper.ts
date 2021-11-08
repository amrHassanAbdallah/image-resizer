import { Service, Inject } from "typedi";
import config from "../config";
import sharp from "sharp";
import path from "path";
import fs from "fs";

@Service()
export default class ImageShaper {
  constructor(@Inject("logger") private logger) {}

  public async Resize(
    imageName: string,
    height: number,
    width: number
  ): Promise<string> {
    let imageLocation = path.join(config.uploads, imageName);
    const thumbFilePath = path.join(
      config.thumbnails,
      `${height}_${width}` + imageName
    );
    const isThumbFound = await fs.existsSync(thumbFilePath);
    if (isThumbFound) {
      return thumbFilePath;
    }

    try {
      await sharp(imageLocation).resize(width, height).toFile(thumbFilePath);
      return thumbFilePath;
    } catch (e) {
      throw e;
    }
  }
}
