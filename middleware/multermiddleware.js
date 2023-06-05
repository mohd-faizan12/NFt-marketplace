const multer = require("multer")
const storageEngine = multer.memoryStorage();
// const upload = multer({ dest: 'uploads/' })

const upload = multer({
    storage: storageEngine,
});

module.exports = upload;