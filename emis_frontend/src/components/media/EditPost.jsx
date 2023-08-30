/** 
 * Calling from: 
 *              ViewPost.jsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const EditPost = ({ post, postUpdated }) => {
    const accessToken = getAccessToken();
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [responseMsg, setResponseMsg] = useState('');
    const [category, setCategory] = useState(post.category);
    const [published, setPublished] = useState(post.published);
    const author = post.author.id;

    
    // here we add more Quill modules as needed
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }], // Headers
            [{ font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike'], // Text formatting
            [{ list: 'ordered' }, { list: 'bullet' }], // Lists
            ['link', 'code', 'code-block'], // Links, images, and code block
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['blockquote'],
            [{ direction: 'rtl' }],
            ['formula'],
            // ['video'],
            // ['clean'],
            // [{ image: { align: '' } }, { image: { align: 'center' } }, { image: { align: 'right' } }],

        ],
    };


    // track content changes 
    const handleEditorChange = (value) => {
        setContent(value);
    };


    // send create/post request to backend through api 
    const handleSave = () => {
        // if title is emptyStatement, return 
        if (!title) {
            return;
        }

        const data = { title, content, author, category, published };
        // console.log(author)
        axios.put(`${API_BASE_URL}/press/${post.id}/`, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                // Request success: handle the response from the backend
                // setResponseMsg("Save successfully.");
                postUpdated(response.data);
            })
            .catch(error => {
                // Request failed: handle the response from the backend
                setResponseMsg("ERROR: post update failed.");
                console.error(error);
            });
    };


    return (
        <div>
            {/* show response message if any  */}
            {responseMsg && (
                <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <strong> {responseMsg} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setResponseMsg('')}></button>
                </div>
            )}

            <form>

                {/* Title Input */}
                <div className="mb-3">
                    <label htmlFor="title" className='py-2 text-secondary'>Title</label>
                    <input
                        type="text"
                        id='title'
                        placeholder="Title"
                        className='form-control py-3 fs-1 fw-bold bg-light'
                        value={title}
                        modules={modules}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>


                {/* Category Dropdown */}
                <div className="mb-3">
                    <label htmlFor="category" className='py-2 text-secondary'>Category</label>
                    <select
                        id="category"
                        className="form-select bg-light"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="notice">Notice</option>
                        <option value="news">News</option>
                        <option value="announcement">Announcement</option>
                        <option value="other">Other</option>
                    </select>
                </div>


                {/* Content Editor  */}
                <div className="my-4 mh-150" id='content'>
                    <label htmlFor="content" className='py-2 text-secondary'>Post content</label>
                    <ReactQuill
                        id='content'
                        value={content}
                        theme="snow"
                        className='mh-150'
                        modules={modules}
                        onChange={handleEditorChange}
                    />
                </div>


                {/* Published Checkbox */}
                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="published"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                    />
                    <label className="form-check-label fw-bold" htmlFor="published">
                        Publish
                    </label>
                </div>


                <button
                    type='button'
                    onClick={handleSave}
                    className='btn btn-darkblue2 px-5 mb-5'
                > Save 
                </button>
            </form>
        </div>
    );
};

export default EditPost;
