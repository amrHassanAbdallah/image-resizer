import {Router} from 'express';
import images from "./routes/images";

export default () => {
    const app = Router();
    images(app);
    return app
}


