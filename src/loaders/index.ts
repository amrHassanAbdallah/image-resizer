import expressLoader from "./express";
import fileLoader from "./storage";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "./logger";
//We have to import at least all the events once so they can be triggered
export default async ({ expressApp }) => {
  await dependencyInjectorLoader();
  await expressLoader({ app: expressApp });
  await fileLoader();

  Logger.info("✌️ Express loaded");
};
