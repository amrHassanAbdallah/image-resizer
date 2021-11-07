[![Node.js CI](https://github.com/amrHassanAbdallah/image-resizer/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/amrHassanAbdallah/image-resizer/actions/workflows/node.js.yml)

# Image resize

Image resize is a service built on top of express js using typescript and jasmine.

## Installation

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install the project.

```bash
npm install
```

## Up & Running

### To start the server 
```bash
npm run start
```

### To run the tests
```bash
npm run test
```

## Usage

1. Upload image
    
    `POST /api/images`
    
    ```bash
    curl --location --request POST 'localhost:3000/api/images' \
    --form 'image=@"your-image.png"'
    ```

1. Access image

    `GET /api/images/your-image.png`
    ```bash
    curl --location --request GET 'localhost:3000/api/images/your-image.png'
    ```
    
 1. Resize the image
 
     `GET /api/images/your-image.png?height=500&width=500`
     ```bash
     curl --location --request GET 'localhost:3000/api/images/your-image.png?height=500&width=500'
     ```

### To test
After running the server using
```bash
npm run start
```

You can use the test image called `t_test_image.png` to access the get endpoint and play with the height&width.

**Ex**
```rest
 curl --location --request GET 'localhost:3000/api/images/t_test_image.png?height=500&width=500'
```
