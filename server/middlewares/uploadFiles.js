import multer from "multer";

const uploadFile = multer({
  limits: {
    fileSize: 1024 * 1025 * 5,
  },
});

const singleFile = uploadFile.single("file");
const multipleFiles = uploadFile.array("files");

export { singleFile, multipleFiles };
