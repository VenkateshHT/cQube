const router = require('express').Router();
const { logger } = require('../../lib/logger');
const auth = require('../../middleware/check-auth');
const axios = require('axios');
var const_data = require('../../lib/config');

const baseUrl = process.env.BASEURL;
router.post('/listBuckets', auth.authController, async function (req, res) {
    try {

        logger.info('---list s3 buckets api ---');
        var params = {};
        const_data.s3.listBuckets(params, function (err, data) {
            if (err) {
                logger.error(err, err.stack);
            }
            else {
                // let names = []

                // data.Buckets.forEach(file => {
                //     names.push(file.Name);
                // })
                res.send(data);
            }          // successful response
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/listFolders/:bucketName', auth.authController, async function (req, res) {
    try {
        // logger.info('---list s3 Folders for bucket api ---');
        // var params = {
        //     Bucket: req.params.bucketName,
        //     Delimiter: '/',
        // };
        // const_data.s3.listObjectsV2(params, function (err, data) {
        //     if (err) {
        //         logger.error(err, err.stack);
        //     }
        //     else {
        //         // let keys = []
        //         // data.Contents.forEach(file => {
        //         //     keys.push(file.Key);
        //         // })
        //         res.send(data)
        //     }
        // });

        let apiresult = await axios.post(`${baseUrl}/auth`,
            {
                username: process.env.EMAIL,
                password: process.env.PASSWORD
            });

        let listFIles = await axios.post(`${baseUrl}/list_files`,
            { "bucket": req.params.bucketName },
            { headers: { 'Authorization': `JWT ${apiresult.data.access_token}` } });

        // listFIles.data.Contents.forEach(item => {
        //     console.log(item.Key.split("/", 1));
        // });
        res.send(listFIles.data.Contents);

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/getDownloadUrl', async function (req, res) {
    try {
        logger.info(`---list s3 Files for bucket ${req.body.bucketName} and folder ${req.body.folderName} api ---`);
        console.log(req.body.fileName, req.body.bucketName);
        let apiresult = await axios.post(`${baseUrl}/auth`,
            {
                username: process.env.EMAIL,
                password: process.env.PASSWORD
            });

        let downloadUrl = await axios.post(`${baseUrl}/download_url`,
            {
                filename: req.body.fileName,
                bucket: req.body.bucketName
            },
            { headers: { 'Authorization': `JWT ${apiresult.data.access_token}` } });
        res.send({ "downloadUrl": downloadUrl.data });

    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

router.post('/listFiles/:bucketName/:folderName', async function (req, res) {
    try {
        logger.info(`---list s3 Files for bucket ${req.params.bucketName} and folder ${req.params.folderName} api ---`);
        var params = {
            Bucket: req.params.bucketName,
            Delimiter: '/',
            Prefix: req.params.folderName + "/"
        };
        const_data.s3.listObjectsV2(params, function (err, data) {
            if (err) {
                logger.error(err, err.stack);
            }
            else {
                let keys = []
                data.Contents.forEach(file => {
                    keys.push({ fileName: file.Key });
                })
                res.send(keys)
            }
        });
    } catch (e) {
        logger.error(`Error :: ${e}`);
        res.status(500).json({ errMsg: "Internal error. Please try again!!" });
    }
});

module.exports = router;