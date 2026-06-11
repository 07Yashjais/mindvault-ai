import axios from "axios";
import parsePDF from "../utils/pdfParser.js";

const extractPDFText =
async (fileUrl) => {

  try {

    const response =
      await axios.get(
        fileUrl,
        {
          responseType:
            "arraybuffer",

          timeout: 30000
        }
      );

    const buffer =
      Buffer.from(
        response.data
      );

    const text =
      await parsePDF(
        buffer
      );

    console.log(text);

    return text;

  } catch (error) {

    console.log(error);

    return "";
  }
};

export default extractPDFText;