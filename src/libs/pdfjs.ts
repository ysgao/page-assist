import * as pdfDist from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfDist.GlobalWorkerOptions.workerSrc = pdfWorker

export {
    pdfDist
};

