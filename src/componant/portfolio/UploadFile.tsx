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
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {files.length === 0 ? (
          <p className="px-4 py-3 text-gray-500 text-sm">No {title.toLowerCase()} uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" tabIndex={0}>
            <table className="min-w-[700px] w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 w-1/3">File</th>
                  <th className="px-4 py-2 w-1/6">Type</th>
                  <th className="px-4 py-2 w-1/12">Size</th>
                  <th className="px-4 py-2 w-1/6">Uploaded</th>
                  <th className="px-4 py-2 w-1/4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr
                    key={file._id}
                    className={`border-b hover:bg-gray-50 transition-colors duration-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-2" title={file.originalName}>
                      {file.originalName}
                    </td>
                    <td className="px-4 py-2">{file.mimeType}</td>
                    <td className="px-4 py-2">{formatFileSize(file.size)}</td>
                    <td className="px-4 py-2">
                      {new Date(file.uploadDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-2 flex space-x-3">
                      {isOpenable(file.mimeType) && (
                        <a
                          href={`${import.meta.env.VITE_API_URL}/api/api/uploads/${encodeURIComponent(file.filename)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                          aria-label={`Open ${file.originalName}`}
                        >
                          Open
                        </a>
                      )}
                      <button
                        onClick={() => handleDownload(file.filename, file.originalName)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={`Download ${file.originalName}`}
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(file._id, file.originalName)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
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

  const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain',
    'video/mp4', 'video/quicktime', 'video/avi',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
  ];

  // Fetch files on mount and after upload
  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/api/files`);
      setState((prev) => ({ ...prev, files: response.data, error: '' }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message || 'Failed to fetch files.',
      }));
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }
    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setState({
        ...state,
        file: selectedFile,
        preview: ['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)
          ? URL.createObjectURL(selectedFile)
          : null,
        error: '',
      });
    } else {
      setState({
        ...state,
        file: null,
        preview: null,
        error: 'Invalid file type. Please upload an image, document, video, or audio file.',
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!state.file) {
      setState({ ...state, error: 'Please select a file.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', state.file);

    try {
      setState({ ...state, uploadProgress: 0, message: '', error: '' });
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
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
      fetchFiles(); // Refresh file list
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload file.';
      console.error('Upload error:', error);
      setState({
        ...state,
        error: errorMessage,
        uploadProgress: 0,
      });
    }
  };

  const handleDownload = async (filename: string, originalName: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/api/download/${encodeURIComponent(filename)}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setState((prev) => ({ ...prev, error: '' }));
    } catch (error: any) {
      console.error('Download error:', error);
      setState((prev) => ({
        ...prev,
        error: `Failed to download file: ${originalName} - ${error.response?.data?.message || error.message}`,
      }));
    }
  };

  const handleDelete = async (id: string, originalName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${originalName}"?`)) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/api/files/${id}`);
      setState((prev) => ({
        ...prev,
        files: prev.files.filter((file) => file._id !== id),
        message: `File "${originalName}" deleted successfully.`,
        error: '',
      }));
    } catch (error: any) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || `Failed to delete file: ${originalName}`;
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

  // Categorize files
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
        <div className="w-20"></div> {/* Spacer for alignment */}
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
            <p className="text-red-600 bg-red-50 p-3 rounded-md text-center mb-4 text-sm">
              {state.error}
            </p>
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