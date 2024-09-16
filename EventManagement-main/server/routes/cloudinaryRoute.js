const express = require('express');
const router = express.Router();
const path = require('path');
const { deleteFile } = require('../middlewares/cloudinary.js');

const cloudinary = require("cloudinary");
cloudinary.config({ 
  cloud_name: 'dopkisa4l', 
  api_key: '683725344288849', 
  api_secret: 'b_B6GoO7_N7kL2d9You59A8xpPc' 
});



router.post("/images", async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.body.image,{
        public_id:Date.now(),
        resource_type:"auto",
      })
      res.send(result);

      } catch (err) {
        console.log(err);
        res.status(500).send("Upload Error!!!");
      }
});
;



router.get('/image', async (req, res) => {
  try {
    const result = await deleteFile('rfad3sqvgvm76dp6igyl');
    res.send(result.url);
  } catch (err) {
    console.log(err);
    res.status(500).send('Upload Error!!!');
  }
});

router.post('/avatar', async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(path.resolve(__dirname, '../uploads/1.png'), {
      resource_type: 'image',
      type: 'upload',
      tags: 'avatar',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Upload Error!!!');
  }
});

router.post('/image', async (req, res) => {
  console.log(req.body.images);
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.image, {
      resource_type: 'image',
      type: 'upload',
      tags: 'memory',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Upload Error!!!');
  }
});

// router.post("/image", async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.body.images, {
//       public_id: Date.now(),
//       resource_type: "auto",
//     })
//     res.send(result);

//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Upload Error!!!");
//   }
// });

router.post('/removeimages', async (req, res) => {
  try {
    let image_id = req.body.public_id;
    cloudinary.uploader.destroy(image_id, (result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Remove Error!!!');
  }
});

module.exports = router;
