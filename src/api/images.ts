
import express from 'express'
import path from 'path'
import fs from 'fs';
import mkdirp from 'mkdirp';
import multer from 'multer';
import sharp from 'sharp';
const imagesRouter = express.Router()
const uploadsLocation = "uploads"
mkdirp.sync(uploadsLocation)


var mime: { [name: string]: string } = {
    "gif": 'image/gif',
    "jpg": 'image/jpeg',
    "png": 'image/png',
    "svg": 'image/svg+xml',
};


const dir = path.join(__dirname, "..", "..", uploadsLocation);

var multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsLocation)
    },
    filename: function (req, file, cb) {
        let currentFileName: string = file.originalname.substr(0, file.originalname.lastIndexOf('.'))
        const name = currentFileName.toLowerCase().split(' ').join('-')
        const ext = path.extname(file.originalname).substring(1)
        console.log(ext, "extttttttttttt")

        cb(null, `${name}.${ext}`) //Appending extension
    }
})



const upload = multer({
    storage: multerStorage, limits: { fileSize: 10 * 1000 * 1000 }, fileFilter: (_req, file, cb) => {
        checkFileType(file, cb);
    }
})

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
imagesRouter.post('/', upload.single('image'), (req: express.Request, res) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        return res.status(400).json({ "hada": "" })
    }
    return res.status(201).json({
        "message": `image uploaded with the name '${req.file?.filename}' make sure to use it when quering the image.`
    })
})




export default imagesRouter

