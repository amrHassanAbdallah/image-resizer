import express from 'express'
import path from 'path'
import fs from 'fs';
import mkdirp from 'mkdirp';

const imagesRouter = express.Router()
const uploadsLocation = "uploads"
mkdirp.sync(uploadsLocation)
import busboy, {Busboy} from "busboy";
import formidable, {File} from "formidable";

var mime: { [name: string]: string } = {
    "gif": 'image/gif',
    "jpg": 'image/jpeg',
    "png": 'image/png',
    "svg": 'image/svg+xml',
};


const dir = path.join(__dirname, "..", "..", uploadsLocation);


function checkFileType(file: Express.Multer.File, cb: Function) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}


imagesRouter.get('/:imageName', async (req: express.Request, res) => {
    const imageName = req.params.imageName
    let isFound: boolean = false
    if (typeof imageName == "undefined" || imageName == "") {
        return res.status(400).json({
            "message": "imageName param is required"
        })
    }
    let file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    console.log(file)
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    //call the write endpoint with the new stream....
    /*     try {
            if (fs.existsSync(path)) {
              //file exists
            }
          } catch(err) {
            console.error(err)
          } */


    var s = fs.createReadStream(file);
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

//todo refactor
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

