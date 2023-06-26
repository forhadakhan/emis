import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config';

const FileUploadForm = ({ onFileUpload, accept_type = 'any', deactive=false }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileStatus, setFileStatus] = useState('');

    const handleFileChange = (event) => {
        const { name, value, type, files } = event.target;
        if (type === 'file' && files && files.length > 0) {
            const file = files[0];
            /**
             * Max image size 300kb
             * Max video size 5mb
             * Max pdf size 5mb
             * Max doc size 5mb
             */
            if (
                accept_type === 'image' &&
                /\.(jpg|jpeg|png)$/.test(file.name) &&
                file.size <= 300 * 1024
            ) {
                setSelectedFile(event.target.files[0]);
            } else if (
                accept_type === 'video' &&
                /\.(mp4|mov|avi)$/.test(file.name) &&
                file.size <= 5 * 1024 * 1024
            ) {
                setSelectedFile(event.target.files[0]);
            } else if (
                accept_type === 'pdf' &&
                /\.(pdf)$/.test(file.name) &&
                file.size <= 5 * 1024 * 1024
            ) {
                setSelectedFile(event.target.files[0]);
            } else if (
                accept_type === 'doc' &&
                /\.(doc|docx)$/.test(file.name) &&
                file.size <= 5 * 1024 * 1024
            ) {
                setSelectedFile(event.target.files[0]);
            } else if (accept_type === 'any') {
                setSelectedFile(event.target.files[0]);
            } else {
                setSelectedFile(null);
            }
        }
    };

    const handleFileUpload = async () => {
        try {
            setFileStatus('Uploading ...');
            const formData = new FormData();
            formData.append('files', selectedFile);

            const response = await axios.post(`${API_BASE_URL}/file/upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const fileLinks = response.data.file_links;
            const fileIds = response.data.file_ids;

            if (fileLinks && fileLinks.length > 0 && fileIds && fileIds.length > 0) {
                const uploadedFileLink = fileLinks[0]; // As we are uploading only one file
                const uploadedFileId = fileIds[0]; // As we are uploading only one file
                onFileUpload(uploadedFileId, uploadedFileLink);
                setSelectedFile(null);
                document.getElementById('file-input').value = null;
                setFileStatus('Successful');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setFileStatus('Failed');
            // Handle the error
        }
        setTimeout(() => {
            setFileStatus('');
        }, 5000);
    };

    const getAcceptedFileTypes = () => {
        switch (accept_type) {
            case 'image':
                return '.jpg, .jpeg, .png';
            case 'video':
                return '.mp4, .mov, .avi';
            case 'pdf':
                return '.pdf';
            case 'doc':
                return '.doc, .docx';
            default:
                return ''; // Return an empty string for default case (allow any file type)
        }
    };

    const getUploadInstructions = () => {
        switch (accept_type) {
            case 'image':
                return 'Only JPG, JPEG, or PNG file allowed (max size 300KB).';
            case 'video':
                return 'Only MP4, MOV, or AVI file allowed (max size 5MB).';
            case 'pdf':
                return 'Only PDF file allowed (max size 5MB).';
            case 'doc':
                return 'Only DOC/DOCX file allowed (max size 5MB).';
            default:
                return ''; // Return an empty string for default case (allow any file type)
        }
    };

    const isUploadDisabled = !selectedFile; // Disable upload button if no file is selected

    return (
        <div className="">
            <button disabled={deactive} type="button" className="btn btn-darkblue" data-bs-toggle="modal" data-bs-target="#fileUploadModal">
                Upload
            </button>
            <div className="modal" tabIndex="-1" id="fileUploadModal" aria-labelledby="fileUploadModalLabel">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-darkblue text-beige">
                            <h5 className="modal-title">Upload File</h5>
                            <button type="button" className="btn-close bg-beige text-darkblue" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div id="file-note" className="d-block text-info m-2" role="alert">
                                {getUploadInstructions()}
                            </div>
                            <div className="text-center input-group">
                                <input
                                    id="file-input"
                                    className="pt-1 form-control border border-darkblue"
                                    type="file"
                                    accept={getAcceptedFileTypes()} // Specify the allowed file types dynamically
                                    onChange={handleFileChange}
                                    multiple={false} // Allow only one file to be selected
                                />
                                <button
                                    type="button"
                                    className="btn btn-darkblue ms-2 fw-bold"
                                    onClick={handleFileUpload}
                                    disabled={isUploadDisabled} // Disable the button if no file is selected
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-darkblue ms-2 pt-1"
                                    onClick={() => {
                                        document.getElementById('file-input').value = null;
                                        setSelectedFile(null);
                                    }}
                                >
                                    <i className="bi bi-file-earmark-excel"></i>
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer text-center">
                            <div className="mx-auto">
                                {fileStatus === 'Uploading ...' && (
                                    <h5 className="fs-6">
                                        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Uploading ...
                                    </h5>
                                )}
                                {fileStatus === 'Successful' && (
                                    <h5 className="text-success fs-6">
                                        <i className="bi bi-check-circle-fill me-2"></i> Upload Successful
                                    </h5>
                                )}
                                {fileStatus === 'Failed' && (
                                    <h5 className="text-danger fs-6">
                                        <i className="bi bi-exclamation-octagon-fill me-2"></i> Upload Failed!
                                    </h5>
                                )}
                                {fileStatus !== 'Uploading ...' && fileStatus !== 'Successful' && fileStatus !== 'Failed' && (
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploadForm;
