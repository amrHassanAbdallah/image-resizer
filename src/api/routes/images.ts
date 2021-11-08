import { Router, Request } from "express";
import path from "path";
import fs from "fs";
import config from "../../config";
import { Container } from "typedi";
import { Logger } from "winston";

import formidable from "formidable";
import ImageShaper from "../../services/image-shaper";

const mime: { [name: string]: string } = {
  gif: "image/gif",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
};
const route = Router();

const isFileValid = (file: formidable.File | formidable.File[]) => {
  if (Array.isArray(file)) {
    return false;
  } else {
    const type = file.mimetype || "";
    let supportedTypes: { [name: string]: string } = {};
    Object.keys(mime).forEach((key) => {
      supportedTypes[mime[key]] = key;
    });

    return supportedTypes[type] != undefined;
  }
};

export default (app: Router) => {
  app.use("/images", route);
  route.get("/:imageName", async (req: Request, res, next) => {
    const logger: Logger = Container.get("logger");
    const imageName = req.params.imageName;
    let imageLocation = path.join(config.uploads, imageName);
    if (imageName.indexOf(path.sep) >= 0) {
      return res.status(403).end("Forbidden");
    }
    if (req.query.width || req.query.height) {
      if (
        isNaN(parseInt(<string>req.query.width)) ||
        isNaN(parseInt(<string>req.query.height))
      ) {
        return res.status(400).json({
          message:
            "invalid value for width or height, both required & must be integer",
        });
      }
    }

    const isFound = await fs.existsSync(imageLocation);
    if (!isFound || imageName == "") {
      return res.status(404).json({
        message: "image not found",
      });
    }

    if (req.query.height) {
      try {
        const imageShaper = Container.get(ImageShaper);
        imageLocation = await imageShaper.Resize(
          imageName,
          parseInt(<string>req.query.height),
          parseInt(<string>req.query.width)
        );
      } catch (e) {
        logger.error("🔥 error: %o", e);
        return next(e);
      }
    }

    let file = imageLocation;
    let type = mime[path.extname(imageName).slice(1)] || "text/plain";
    let s = fs.createReadStream(file);
    s.on("open", function () {
      res.set("Content-Type", type);
      s.pipe(res);
    });
    s.on("error", function () {
      res.set("Content-Type", "text/plain");
      res.status(404).json({
        message: "image not found",
      });
    });
  });

  route.post("/", (req: Request, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        return;
      }
      if (files.image) {
        const file = files.image;
        if (Array.isArray(file)) {
          return res.status(400).json({
            message: "Only one file allowed",
          });
        } else {
          let isValid = isFileValid(file);
          if (!isValid) {
            // throes error if file isn't valid
            return res.status(400).json({
              message: "The file type is not a valid type",
            });
          }
          let fileName = file.originalFilename ? file.originalFilename : "";
          fileName = encodeURIComponent(fileName.replace(/\s/g, "-"));
          try {
            // renames the file in the directory
            fs.renameSync(file.filepath, path.join(config.uploads, fileName));
          } catch (error) {
            console.log(error);
          }

          return res.status(201).json({
            message: `image uploaded.`,
            image_name: fileName,
          });
        }
      } else {
        return res.status(400).json({ message: "Please upload a file" });
      }
    });
    /*const file = req.file
        if (!file) {
            return res.status(400).json({ "message": "Please upload a file" })
        }*/
  });
};
