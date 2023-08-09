const { s3 } = require("../config");



const uploadFileAWS = async (file: any) => {
    // console.log(file)
    const params = {
        Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
    };

    var data = await s3.upload(params)
    console.log(data.location)
}

module.exports = {
    uploadFileAWS
}