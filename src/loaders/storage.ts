import mkdirp from "mkdirp";
import config from "../config";

export default () => {
  mkdirp.sync(config.uploads);
  mkdirp.sync(config.thumbnails);
};
