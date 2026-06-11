import mongoose
from "mongoose";

const documentSchema =
new mongoose.Schema(
{
  userId: {
    type:
      mongoose.Schema
        .Types.ObjectId,

    ref: "User"
  },

  title: {
    type: String,
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  publicId: {
    type: String
  },

  fileType: {
    type: String,
    default: "pdf"
  },

  status: {
    type: String,

    enum: [
      "processing",
      "completed",
      "failed"
    ],
    

    default:
      "processing"
  },
  extractedText: {
  type: String,
  default: ""
},

chunks: [
{
text: {
type: String
},

embedding: {
type: [Number]
}
}
],

},
{
  timestamps: true
}
);

const Document =
mongoose.model(
  "Document",
  documentSchema
);

export default Document;