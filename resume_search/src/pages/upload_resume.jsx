import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const UploadResumePage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (optional)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid resume file (PDF or DOC/DOCX)');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Upload file
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('is_private', 0);

      const csrfToken = window.csrf_token;

      const uploadResponse = await fetch('/api/method/upload_file', {
        method: 'POST',
        headers: {
          'X-Frappe-CSRF-Token': csrfToken,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const uploadData = await uploadResponse.json();
      const fileUrl = uploadData.message.file_url;
      const fileName = uploadData.message.file_name;

      // Step 2: Create Resume record
      const docPayload = {
        resume_file: fileUrl,
        upload_by: 'Manual',
        approve_status: 0,
        title: fileName
      };

      const resumeResponse = await fetch('/api/resource/Resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(docPayload),
      });

      if (!resumeResponse.ok) {
        const errorData = await resumeResponse.json();

        // Check if it's a duplicate candidate error
        if (errorData.exception && errorData.exception.includes('already exists in the system')) {
          throw new Error('This candidate already exists in the system. Please select another resume.');
        }

        // Check for other validation errors
        if (errorData._server_messages) {
          try {
            const messages = JSON.parse(errorData._server_messages);
            if (messages && messages.length > 0) {
              const firstMessage = JSON.parse(messages[0]);
              throw new Error(firstMessage.message || 'Resume creation failed');
            }
          } catch (parseError) {
            // If parsing fails, use generic error
          }
        }

        throw new Error('Resume creation failed. Please try again.');
      }

      const resumeData = await resumeResponse.json();

      setSuccess('Resume uploaded successfully!');
      setSelectedFile(null);

      // Reset file input
      e.target.reset();

      // Optionally redirect after success
      setTimeout(() => {
        navigate(`/resume_search/detail/${resumeData?.data?.name}`);
      }, 2000);

    } catch (err) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
            <p className="mt-2 text-sm text-gray-600">
              Upload a resume file to add it to the database
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* File Upload Section */}
              <div>
                <label
                  htmlFor="resume-file"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Resume File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="resume-file"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="resume-file"
                          name="resume-file"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>

                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Selected file:</span> {selectedFile.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/resume_search/search')}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? 'Uploading...' : 'Submit'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UploadResumePage;
