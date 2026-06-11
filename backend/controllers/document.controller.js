import cloudinary
from "../config/cloudinary.js";

import Document
from "../models/Document.js";

import extractPDFText
from "../services/pdf.service.js";

import chunkText
from "../utils/textChunker.js";

import generateEmbedding
from
"../services/embedding.service.js";

import searchRelevantChunks, {
  generateAnswer,
} from "../services/search.service.js";

import Chat
from "../models/Chat.js";

export const uploadDocument =
async (
  req,
  res
) => {

try {

if (!req.file) {
return res
.status(400)
.json({
message:
"No file uploaded"
});
}

const result =
await new Promise(
(resolve, reject) => {

cloudinary.uploader
.upload_stream(
{
resource_type:
"raw",

folder:
"mindvault"
},

(error, result) => {

if (error)
reject(error);

resolve(result);
}
)
.end(
req.file.buffer
);
}
);

const extractedText =
await extractPDFText(
  result.secure_url
);

const rawChunks =
chunkText(
extractedText
);

const chunks =
await Promise.all(

rawChunks.map(
async (
chunk
) => ({

text: chunk,

embedding:
await
generateEmbedding(
chunk
)

})
)

);


const document =
await Document.create(
{
userId:
req.user.userId,

title:
req.file.originalname,

fileUrl:
result.secure_url,

publicId:
result.public_id,

extractedText,

chunks,

status:
"completed"
}
);

return res
.status(201)
.json({
success: true,
document
});

} catch (error) {

  console.log(error);

  return res.status(500).json({
    message: error.message,
    error
  });
}
};


export const askDocument =
async (req, res) => {

try {

const { question }
= req.body;

const { id }
= req.params;
console.log("PARAM ID:", req.params.id);



const document =
await Document.findOne({
_id: id,
userId:
req.user.userId
});

console.log("FOUND DOCUMENT:", document);

if (!document) {

return res
.status(404)
.json({
message:
"Document not found"
});
}

const relevantChunks =
await searchRelevantChunks(
  question,
  document.chunks
);

const topMatch =
relevantChunks[0];

const aiAnswer =
await generateAnswer(
  question,
  topMatch.text
);
await Chat.create({

documentId:
document._id,

userId:
req.user.userId,

question,

answer:
aiAnswer
});

return res
.status(200)
.json({
  success: true,
  question,
  answer: aiAnswer,
  similarity:
    topMatch.similarity
});

} catch (error) {

console.log(error);

return res
.status(500)
.json({
message:
error.message
});
}
};

export const getUserDocuments =
async (req, res) => {

try {

const documents =
await Document.find({
userId:
req.user.userId
})
.select(
"title status createdAt"
)
.sort({
createdAt: -1
});

return res
.status(200)
.json({
success: true,
documents
});

} catch (error) {

console.log(error);

return res
.status(500)
.json({
message:
error.message
});
}
};

export const deleteDocument =
async (req, res) => {

try {

const { id } =
req.params;

const document =
await Document.findOne({
_id: id,
userId:
req.user.userId
});

if (!document) {

return res
.status(404)
.json({
message:
"Document not found"
});
}

await cloudinary.uploader.destroy(
document.publicId,
{
resource_type:
"raw"
}
);

await Document.findByIdAndDelete(
id
);

return res
.status(200)
.json({
success: true,
message:
"Document deleted successfully"
});

} catch (error) {

console.log(error);

return res
.status(500)
.json({
message:
error.message
});
}
};

export const getDocumentById =
async (req, res) => {

try {

const { id } =
req.params;

const document =
await Document.findOne({
_id: id,
userId:
req.user.userId
});

if (!document) {

return res
.status(404)
.json({
message:
"Document not found"
});
}

return res
.status(200)
.json({
success: true,
document
});

} catch (error) {

console.log(error);

return res
.status(500)
.json({
message:
error.message
});
}
};