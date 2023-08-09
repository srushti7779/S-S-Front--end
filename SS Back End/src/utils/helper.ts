import AWS from "aws-sdk";
import generateUid from "./crypto";

export const PERMISSION_FORM_TYPE_ENUMS = {
  BANK_ACCOUNT_FORM_TYPE_ENUM: "bank-account",
  CREDIT_CARD_FORM_TYPE_ENUM: "credit-card",
  LOAN_ACCOUNT_FORM_TYPE_ENUM: "loan-account",
  MERCHANT_ACCOUNT_FORM_TYPE_ENUM: "merchant-account",
  MISC_PASSWORD_FORM_TYPE_ENUM: "misc-password",
  PASSWORD_STORAGE_FORM_TYPE_ENUM: "password-storage",
  RECIPE_FORM_TYPE_ENUM: "recipe-storage",
};

export const mailOptions = (email: any, user: any) => {
  return {
    from: "Store And Share Vault",
    to: email,
    subject: "Buddy Request",
    html: `<p>Hi ${email.split("@")[0]},</p><br/><p> ${
      user?.email.split("@")[0]
    } would like to add you as a Buddy on their Store and Share Vault Account! Click the link below to register:</p><br/><a href="https://app.sandsvault.io//auth/signup">https://app.sandsvault.io//auth/signup</a><br/><p>Once you register, you will be able to access your buddy's account and view their files.</p><br/><p>Thanks,</p><br/><p>Store and Share Vault Team</p>`,
  };
};

export const PLANS_PRODUCTS = [
  {
    planName: "Basic Plan",
    timePeriod: "Monthly",
    planId: "price_1NVQbUEgMk0fYPeI5DeaclIY",
  },
  {
    planName: "Basic Plan",
    timePeriod: "Yearly",
    planId: "price_1NT9f2EgMk0fYPeIHVAwjgpj",
  },
  {
    planName: "Standard Plan",
    timePeriod: "Monthly",
    planId: "price_1NT9foEgMk0fYPeIGzdr0b4N",
  },
  {
    planName: "Standard Plan",
    timePeriod: "Yearly",
    planId: "price_1NT9gZEgMk0fYPeIJbkxvkNQ",
  },
  {
    planName: "Premium Plan",
    timePeriod: "Monthly",
    planId: "price_1NT9hNEgMk0fYPeIupxHwQJw",
  },
  {
    planName: "Premium Plan",
    timePeriod: "Yearly",
    planId: "price_1NT9htEgMk0fYPeImyaNExAv",
  },
];

export const documentUpload = async (file: any, fileKey: any) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_STORAGE_REGION,
  });

  const key = fileKey;
  const s3 = new AWS.S3();
  const Blob = file.buffer;
  const params: any = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: key,
    Body: Blob,
  };

  if (file.customContentType) {
    params.ContentType = file.customContentType;
  }

  const options = { partSize: 10 * 1024 * 1024, queueSize: 1 };

  await s3.upload(params, options).promise();
  return key;
};

export const getDocument = async (file: any) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_STORAGE_REGION,
  });

  const s3 = new AWS.S3();
  const params: any = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: file,
  };
  return await s3.getObject(params).promise();
};

export const getExtension = async (filename: any) => {
  const part = filename.split(".");
  return part[part.length - 1];
};

export const getLink = async (path: any) => {
  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: path,
    Expires: 60,
  };

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_STORAGE_REGION,
    signatureVersion: "v4",
  });

  const s3 = new AWS.S3();

  return new Promise((resolve, reject) =>
    s3.getSignedUrl("getObject", params, async (e, url) => {
      if (e) {
        reject(e);
      }
      resolve(url);
    })
  );
};
