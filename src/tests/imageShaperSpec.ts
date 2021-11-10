import fs from "fs";
import path from "path";
import {Container} from "typedi";
import ImageShaper from "../services/imageShaper";
import sharp from "sharp";
import config from "../config";
import FileNotFoundErr from "../errors/FileNotFoundErr";


describe("Test imageShaper svc", () => {


    it("should resize the image if exist", async (done) => {
        const imageShaper = Container.get(ImageShaper);
        let expectedWidth = 300
        let expectedHeight = 200

        let resizedImagePlace = await imageShaper.Resize(
            "t_test_image.png",
            expectedHeight,
            expectedWidth
        );

        let fileMeta = await sharp(resizedImagePlace).metadata();
        expect(fileMeta.height).toEqual(expectedHeight)
        expect(fileMeta.width).toEqual(expectedWidth)
        done()
    })
    it("should fail when image not exist", async (done) => {
        const imageShaper = Container.get(ImageShaper);
        let expectedWidth = 300
        let expectedHeight = 200
        await imageShaper.Resize(
            "image_not_there.png",
            expectedHeight,
            expectedWidth
        ).catch((e)=>{
            expect(e.message).toEqual((new FileNotFoundErr).message);
        })
        done()
    })
});
