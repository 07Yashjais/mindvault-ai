import * as pdfjsLib
from "pdfjs-dist/legacy/build/pdf.mjs";

const parsePDF =
async (buffer) => {

  const loadingTask =
    pdfjsLib.getDocument({
      data: new Uint8Array(
        buffer
      )
    });

  const pdf =
    await loadingTask.promise;

  let text = "";

  for (
    let i = 1;
    i <= pdf.numPages;
    i++
  ) {

    const page =
      await pdf.getPage(i);

    const content =
      await page.getTextContent();

    const pageText =
      content.items
        .map(
          item => item.str
        )
        .join(" ");

    text +=
      pageText + "\n";
  }

  return text;
};

export default parsePDF;