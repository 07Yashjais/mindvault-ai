import { useEffect, useState }
from "react";

import { useNavigate }
from "react-router-dom";

import {
  uploadDocument,
  getDocuments,
} from "../services/documentService";

function Dashboard() {

  const navigate =
  useNavigate();

  const [file,
  setFile] =
  useState(null);

  const [documents,
  setDocuments] =
  useState([]);

  const [loading,
  setLoading] =
  useState(false);

  const fetchDocuments =
  async () => {

    try {

      const data =
      await getDocuments();

      setDocuments(
        data.documents
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to fetch documents"
      );
    }
  };

  useEffect(() => {

    fetchDocuments();

  }, []);

  const handleUpload =
  async () => {

    if (!file) {

      return alert(
        "Select a PDF first"
      );
    }

    try {

      setLoading(true);

      await uploadDocument(
        file
      );

      alert(
        "Uploaded successfully"
      );

      setFile(null);

      fetchDocuments();

    } catch (error) {

      console.log(error);

      alert(
        "Upload failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen
      bg-gray-100
      p-10
    ">

      <h1 className="
        text-4xl
        font-bold
        mb-10
      ">
        MindVault Dashboard
      </h1>

      <div className="
        bg-white
        p-6
        rounded-xl
        shadow-md
        mb-10
      ">

        <h2 className="
          text-2xl
          font-semibold
          mb-4
        ">
          Upload PDF
        </h2>

        <div className="
          flex
          items-center
          gap-4
        ">

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />

          <button
            onClick={
              handleUpload
            }
            disabled={
              loading
            }
            className="
              bg-black
              text-white
              px-6
              py-2
              rounded
            "
          >
            {loading
              ? "Uploading..."
              : "Upload"}
          </button>

        </div>
      </div>

      <h2 className="
        text-3xl
        font-bold
        mb-5
      ">
        My Documents
      </h2>

      <div className="
        flex
        flex-col
        gap-5
      ">

        {documents.map(
          (doc) => (

          <div
            key={doc._id}
            onClick={() =>
              navigate(
                `/chat/${doc._id}`
              )
            }
            className="
              bg-white
              p-5
              rounded-xl
              shadow-md
              cursor-pointer
              hover:shadow-lg
              transition
            "
          >

            <h3 className="
              text-xl
              font-bold
            ">
              {doc.title}
            </h3>

            <p>
              Status:
              {" "}
              {doc.status}
            </p>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;