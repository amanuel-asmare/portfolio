import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface FileUploadState {
  file: File | null;
  preview: string | null;
  uploadProgress: number;
  message: string;
  error: string;
  files: FileMetadata[];
}

interface FileMetadata {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  path: string;
  size: number;
  uploadDate: string;
}

const mimeTypeCategories: Record<string, string> = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'application/pdf': 'document',
  'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
  'text/plain': 'document',
  'video/mp4': 'video',
  'video/quicktime': 'video',
  'video/avi': 'video',
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'audio/ogg': 'audio',
};

interface AccordionProps {
  title: string;
  files: FileMetadata[];
  isOpenable: (mimeType: string) => boolean;
  handleDownload: (filename: string, originalName: string) => Promise<void>;
  handleDelete: (id: string, originalName: string) => Promise<void>;
  formatFileSize: (bytes: number) => string;
  isOpen: boolean;
  toggleOpen: () => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  files,
  isOpenable,
  handleDownload,
  handleDelete,
  formatFileSize,
  isOpen,
  toggleOpen,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={toggleOpen}
        className="w-full bg-gray-100 px-4 py-3 flex justify-between items-center text-left text-gray-900 font-semibold text-sm hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-controls={`${title.toLowerCase()}-content`}
      >
        <span>{title} ({files.length})</span>
        <ChevronDownIcon
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={`${title.toLowerCase()}-content`}
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 hidden'
        }`}
      >
        {files.length === 0 ? (
          <p className="px-4 text-center py-3 text-gray-500 text-sm sm:text-sm">No {title.toLowerCase()} files uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 text-sm">
            <table className="min-w-[600px] w-full text-center sm:min-w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-2 sm:px-4 py-2 w-1/3">File</th>
                  <th className="px-2 sm:px-4 py-2 w-1/6">Type</th>
                  <th className="px-2 sm:px-4 py-2 w-1/12">Size</th>
                  <th className="px-2 sm:px-4 py-2 w-1/6">Date</th>
                  <th className="px-2 sm:px-4 py-2 w-1/4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, idx) => (
                  <tr
                    key={file._id}
                    className={`border-b hover:bg-gray-100 transition-colors duration-200 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    `}
                  >
                    <td className="px-2 sm:px-4 py-2 truncate" title={file.originalName}>
                      {file.originalName}
                    </td>
                    <td className="px-2 sm:px-4 py-2">{file.mimeType}</td>
                    <td className="px-2 sm:px-4 py-2">{formatFileSize(file.size)}</td>
                    <td className="px-2 sm:px-4 py-2">
                      {new Date(file.uploadDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-2 sm:px-4 py-2 flex justify-center space-x-2 sm:space-x-3">
                      {isOpenable(file.mimeType) && (
                        <a
                          href={`${import.meta.env.VITE_API_URL}/api/uploads/${encodeURIComponent(file.filename)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                          aria-label={`Open ${file.originalName}`}
                          onClick={() => console.log(`Opening file: ${file.filename}`)}
                        >
                          Open
                        </a>
                      )}
                      <button
                        onClick={() => handleDownload(file.filename, file.originalName)}
                        className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={`Download ${file.originalName}`}
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(file._id, file.originalName)}
                        className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        aria-label={`Delete ${file.originalName}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const UploadFile: React.FC = () => {
  const [state, setState] = useState<FileUploadState>({
    file: null,
    preview: null,
    uploadProgress: 0,
    message: '',
    error: '',
    files: [],
  });
  const navigate = useNavigate();
  const [accordionState, setAccordionState] = useState({
    images: true,
    videos: false,
    audio: false,
    documents: false,
  });
  const [retryCount, setRetryCount] = useState(0);

  const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain',
    'video/mp4', 'video/quicktime', 'video/avi',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
  ];

  const fetchFiles = async (attempt = 1, maxRetries = 3) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/files`, {
        timeout: 10000,
      });
      setState((prev) => ({ ...prev, files: response.data, error: '' }));
      setRetryCount(0);
    } catch (error: any) {
      console.error('Fetch files error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch files';
      if (attempt < maxRetries) {
        console.log(`Retrying fetch files (${attempt + 1}/${maxRetries})...`);
        setTimeout(() => {
          setRetryCount(attempt);
          fetchFiles(attempt + 1, maxRetries);
        }, 2000 * attempt);
      } else {
        setState((prev) => ({
          ...prev,
          error: `${errorMessage}. All ${maxRetries} retries failed. Please try refreshing the page.`,
        }));
        setRetryCount(0);
      }
    }
  };

  useEffect(() => {
    fetchFiles();
    return () => {
      if (state.preview) {
        URL.revokeObjectURL(state.preview);
      }
    };
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }
    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setState({
        ...state,
        file: selectedFile,
        preview: ['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type) ? URL.createObjectURL(selectedFile) : null,
        error: '',
      });
    } else {
      setState({
        ...state,
        file: null,
        preview: null,
        error: 'Invalid file type. Please upload an image, PDF, document, video, or audio file.',
      });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!state.file) {
      setState({ ...state, error: 'Please select a file.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', state.file);

    try {
      setState({ ...state, uploadProgress: 0, message: '', error: '' });
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 50000,
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setState((prev) => ({ ...prev, uploadProgress: percent }));
        },
      });
      setState({
        ...state,
        file: null,
        preview: null,
        uploadProgress: 0,
        message: response.data.message,
        error: '',
      });
      fetchFiles();
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload file. Please try again.';
      setState({
        ...state,
        error: errorMessage,
        uploadProgress: 0,
      });
    }
  };

  const handleDownload = async (filename: string, originalName: string) => {
    try {
      console.log(`Initiating download for: ${filename}`);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/download/${encodeURIComponent(filename)}`, {
        responseType: 'blob',
        timeout: 15000,
      });
      console.log(`Download response status: ${response.status}, Content-Type: ${response.headers['content-type']}`);
      const url = URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setState((prev) => ({ ...prev, error: '' }));
    } catch (error: any) {
      console.error(`Download error for ${filename}:`, error);
      const errorMessage = error.response?.data?.message || `Failed to download file: ${originalName}. It may no longer be available. Status: ${error.response?.status || 'unknown'}.`;
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  };

  const handleDelete = async (id: string, originalName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${originalName}"?`)) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/files/${id}`, {
        timeout: 10000,
      });
      setState((prev) => ({
        ...prev,
        files: prev.files.filter((file) => file._id !== id),
        message: `File "${originalName}" deleted successfully.`,
        error: '',
      }));
      fetchFiles();
    } catch (error: any) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || `Failed to delete file: ${originalName}. Please try again.`;
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isOpenable = (mimeType: string): boolean => {
    return [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf',
      'video/mp4', 'video/quicktime', 'video/avi',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
    ].includes(mimeType);
  };

  const categorizedFiles = state.files.reduce(
    (acc, file) => {
      const category = mimeTypeCategories[file.mimeType] || 'document';
      acc[category].push(file);
      return acc;
    },
    { image: [], video: [], audio: [], document: [] } as Record<string, FileMetadata[]>,
  );

  const toggleAccordion = (category: keyof typeof accordionState) => {
    setAccordionState((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <header className="bg-white max-w-4xl w-full mx-auto p-4 rounded-xl shadow-md sticky top-0 z-10 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
          aria-label="Go back to previous page"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-800">File Upload</h1>
        <div className="w-20"></div>
      </header>
      <main className="max-w-4xl w-full mx-auto mt-8 space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Upload a File</h2>
          {state.message && (
            <p className="text-green-600 bg-green-50 p-3 rounded-md text-center mb-4 text-sm">
              {state.message}
            </p>
          )}
          {state.error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-md text-center mb-4 text-sm">
              <p>{state.error}</p>
              {retryCount > 0 && (
                <p>Retrying... Attempt {retryCount + 1}/3</p>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <label
                htmlFor="file-upload"
                className="w-full max-w-md bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,video/*,audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-gray-600 text-sm">
                  {state.file ? state.file.name : 'Drag and drop or click to select a file'}
                </span>
              </label>
              {state.preview && (
                <img
                  src={state.preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md shadow-sm"
                />
              )}
              {state.uploadProgress > 0 && (
                <div className="w-full max-w-md">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-300 ease-out"
                      style={{ width: `${state.uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-xs text-gray-600 mt-2">{state.uploadProgress}%</p>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!state.file || state.uploadProgress > 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload File
            </button>
          </form>
        </section>
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Uploaded Files</h3>
          <div className="space-y-2">
            <Accordion
              title="Images"
              files={categorizedFiles.image}
              isOpenable={isOpenable}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
              formatFileSize={formatFileSize}
              isOpen={accordionState.images}
              toggleOpen={() => toggleAccordion('images')}
            />
            <Accordion
              title="Videos"
              files={categorizedFiles.video}
              isOpenable={isOpenable}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
              formatFileSize={formatFileSize}
              isOpen={accordionState.videos}
              toggleOpen={() => toggleAccordion('videos')}
            />
            <Accordion
              title="Audio"
              files={categorizedFiles.audio}
              isOpenable={isOpenable}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
              formatFileSize={formatFileSize}
              isOpen={accordionState.audio}
              toggleOpen={() => toggleAccordion('audio')}
            />
            <Accordion
              title="Documents"
              files={categorizedFiles.document}
              isOpenable={isOpenable}
              handleDownload={handleDownload}
              handleDelete={handleDelete}
              formatFileSize={formatFileSize}
              isOpen={accordionState.documents}
              toggleOpen={() => toggleAccordion('documents')}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default UploadFile;