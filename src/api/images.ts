import express from 'express'
import path from 'path'
import fs from 'fs';
import mkdirp from 'mkdirp';
import sharp from "sharp";

const imagesRouter = express.Router()
const uploadsLocation = "uploads"
mkdirp.sync(uploadsLocation)
mkdirp.sync(getThumbDirectory())
import formidable, {File} from "formidable";

var mime: { [name: string]: string } = {
    "gif": 'image/gif',
    "jpg": 'image/jpeg',
    "png": 'image/png',
    "svg": 'image/svg+xml',
};

imagesRouter.get('/:imageName', async (req: express.Request, res) => {

    const imageName = req.params.imageName
    const imageLocation = path.join(uploadsLocation, imageName);
    if (imageName.indexOf(path.sep) >= 0) {
        return res.status(403).end('Forbidden');
    }
    let thumbPath = ""
    const isFound = await fs.existsSync(imageLocation)
    if (!isFound || imageName == "") {
        return res.status(404).json({
            "message": "image not found"
        })
    }

    if (req.query.height || req.query.width) {
        let fileMeta = await sharp(imageLocation).metadata();
        const thumbFilePath = path.join(getThumbDirectory(), imageName)
        const isThumbFound = await fs.existsSync(thumbFilePath)
        let height: number | undefined = parseInt(<string>req.query.height);
        let width: number | undefined = parseInt(<string>req.query.width);
        if(isThumbFound) {
            fileMeta = await sharp(thumbFilePath).metadata();
        }

        thumbPath = thumbFilePath
        if (!isNaN(height) && height != fileMeta.height || !isNaN(width) && width != fileMeta.width) {
            if (isNaN(width)) {
                width = fileMeta.width
            }
            if (isNaN(height)) {
                height = fileMeta.height
            }
            try {
                await sharp(imageLocation).resize(width, height).toFile(thumbFilePath)

            } catch (e) {

            }

        }
    }


    let file = thumbPath != "" ? thumbPath : imageLocation
    let type = mime[path.extname(imageName).slice(1)] || 'text/plain';
    let s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).json({
            "message": "image not found"
        });
    });


})

const isFileValid = (file: formidable.File | formidable.File[]) => {
    if (Array.isArray(file)) {
        return false
    } else {
        const type = file.mimetype || "";
        let supportedTypes: { [name: string]: string } = {}
        Object.keys(mime).forEach(key => {
            supportedTypes[mime[key]] = key
        })

        return supportedTypes[type] != undefined;
    }
};

function getThumbDirectory() {
    return path.join(uploadsLocation, "thumb")
}
imagesRouter.post('/', (req: express.Request, res) => {
    const form = formidable({multiples: true});
    form.parse(req, (err, fields, files) => {
        if (err) {
            return;
        }
        if (files.image) {
            const file = files.image
            if (Array.isArray(file)) {
                return res.status(400).json({
                    message: "Only one file allowed",
                });
            } else {
                let isValid = isFileValid(file)
                if (!isValid) {
                    // throes error if file isn't valid
                    return res.status(400).json({
                        message: "The file type is not a valid type",
                    });
                }
                let fileName = file.originalFilename ? file.originalFilename : ""
                fileName = encodeURIComponent(fileName.replace(/\s/g, "-"));
                try {
                    // renames the file in the directory
                    fs.renameSync(file.filepath, path.join(uploadsLocation, fileName));
                } catch (error) {
                    console.log(error);
                }

                return res.status(201).json({
                    "message": `image uploaded.`,
                    "image_name": fileName
                })
            }


        } else {
            return res.status(400).json({"message": "Please upload a file"})
        }
    });
    /*const file = req.file
    if (!file) {
        return res.status(400).json({ "message": "Please upload a file" })
    }*/

})


export default imagesRouter

