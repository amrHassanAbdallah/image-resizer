import supertest from 'supertest';
import {app} from '../index';
import fs from 'fs';
import path from "path";
const testImageLocation = 'test_image.png'
const uploadFolderName = "uploads"

const request = supertest(app);
let testFilePath:string = "";
describe("Test image viewing",()=>{
    const testReadImageName = "read_"+testImageLocation
    beforeAll(()=>{
        fs.createReadStream(testImageLocation).pipe(fs.createWriteStream(path.join(uploadFolderName,testReadImageName)));
    })
    afterAll(()=>{
        fs.unlinkSync(path.join(uploadFolderName,testReadImageName))
    })
    it('should view the image if exist', function (done) {
        request
            .get('/api/images/'+testReadImageName)
            .expect(200)
            .end((error) => (error) ? done.fail(error) : done());
    });
    it('should resize the image height', function (done) {
        request
            .get('/api/images/'+testReadImageName+"?height=500")
            .expect(200)
            .end((error) => (error) ? done.fail(error) : done());
    });
    it('should resize the image width', function (done) {
        request
            .get('/api/images/'+testReadImageName+"?width=500")
            .expect(200)
            .end((error) => (error) ? done.fail(error) : done());
    });
    it('should resize the image width & height', function (done) {
        request
            .get('/api/images/'+testReadImageName+"?width=200&height=200")
            .expect(200)
            .end((error) => (error) ? done.fail(error) : done());
    });
    it('should return 404 if the image not there', function (done) {
        request
            .get('/api/images/hamda.png')
            .expect(404)
            .end((error) => (error) ? done.fail(error) : done());
    });
})
describe('Test image storing endpoint responses', () => {


    it('store image the api endpoint', async (done) => {
        // Test if the test file is exist
                request
                    .post('/api/images/')
                    .attach('image', testImageLocation)
                    .expect(201)
                    .expect((response)=>{
                        expect(response.body.message).toEqual("image uploaded.")
                        testFilePath = response.body.image_name
                    })
                    .end((error) => (error) ? done.fail(error) : done());
            });


    afterAll(function() {
        if (testFilePath != ""){
            console.log("inside the tear down",testFilePath)
            fs.unlinkSync(path.join("uploads",testFilePath))
        }
    })
});
