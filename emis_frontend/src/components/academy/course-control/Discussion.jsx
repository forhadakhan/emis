/**
 * Calling from: 
 *              ManageTeacherCourses.jsx
 *              ControlOfferedCourse.jsx
 * Calling to: 
 */


import React, { useEffect, useState, useRef } from 'react';
import { getAccessToken, getUserId } from '../../../utils/auth';
import { customDateFormat } from '../../../utils/utils';
import API_BASE_URL from '../../../utils/config';
import axios from 'axios';
import * as Popper from "@popperjs/core" // needed for dropdown


const Discussion = ({ courseOffer }) => {
    const accessToken = getAccessToken();
    const loggedUserId = getUserId();
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(true);
    const [editMyComment, setEditMyComment] = useState(false);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentSuccess, setCommentSuccess] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState('');
    const [newComment, setNewComment] = useState('');
    const [existingComments, setExistingComments] = useState([]);
    const [isLatestFirst, setIsLatestFirst] = useState(true);
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    // auto height control for add comment textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newComment]);


    const resizeTextarea = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleTextareaChange = (event) => {
        setText(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
    };


    // Sort comments based on the sorting state
    const sortedComments = existingComments.sort((a, b) => {
        if (isLatestFirst) {
            return new Date(b.created_at) - new Date(a.created_at);
        } else {
            return new Date(a.created_at) - new Date(b.created_at);
        }
    });

    // submit a new comment 
    const handleCommentSumbit = async () => {
        try {
            // Set the request headers with the access token
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const data = {
                text: newComment,
            };

            const response = await axios.post(`${API_BASE_URL}/academy/courseoffer/${courseOffer.id}/comments/`,
                data,
                { headers }
            );

            // console.log(response.data);

            // Clear the input field after successful submission
            setNewComment('');
            setRefresh(!refresh);
            setCommentSuccess(true);

            // Set commentSuccess back to false after 3 seconds
            setTimeout(() => {
                setCommentSuccess(false);
            }, 3000);
        } catch (error) {
            setError("Error posting comment")
            console.error('Error adding comment:', error);
        }
    };

    // get existing comments
    const fetchExistingComments = async () => {
        try {
            // Set the request headers with the access token
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await axios.get(`${API_BASE_URL}/academy/courseoffer/${courseOffer.id}/comments/`,
                { headers }
            );
            const data = response.data;
            setExistingComments(data);
            if (data && (data < 1)) setShowCommentBox(true);

        } catch (error) {
            setError("Error fetching comments")
            console.error('Error fetching comments:', error);
        }
    };
    useEffect(() => {
        fetchExistingComments();
    }, [refresh]);


    const handleEditComment = (comment) => {
        setSelectedCommentId(comment.id);
        setText(comment.text);
        setEditMyComment(!editMyComment);
    }

    const handleDeleteComment = (id) => {

    }



    return (<>

        <h4 className="fs-6 text-center font-merriweather">
            <i className="bi px-2 bi-chat-right-quote"></i>
            Discussion Thread for course
            <small className="bg-beige p-1 m-1 rounded"> {courseOffer.course.acronym} {courseOffer.course.code} </small>
            <small className="bg-secondary text-white p-1 m-1 rounded"> {courseOffer.semester.term.name} {courseOffer.semester.year} </small>
        </h4>

        {/* show api request error message  */}
        {error && (
            <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                <i className="bi bi-x-octagon-fill"> </i>
                <strong> {error} </strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
            </div>
        )}

        <div className="container mt-5">
            <div className="my-4 mx-auto">

                {/* comment heading and buttons for comment post and sort  */}
                <div className='d-flex font-merriweather'>
                    <h3 className='fs-5 border-bottom border-5 text-secondary py-2 my-3 d-inline-block me-auto'>
                        Comments
                        <button
                            className='btn btn-light mx-2'
                            data-bs-toggle="tooltip"
                            title="Reload Comments"
                            onClick={() => setRefresh(!refresh)}
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>
                    </h3>
                    <div className="ms-auto">

                        {/* new comment button  */}
                        <button
                            data-bs-toggle="tooltip"
                            title="Comment Box"
                            className="btn btn-light btn-darkblue pt-1 mx-1 my-3"
                            onClick={() => { setShowCommentBox(!showCommentBox) }}>
                            <i className="bi bi-pencil-square"></i>
                        </button>

                        {/* sort button  */}
                        <button
                            data-bs-toggle="tooltip"
                            title="Sort by time"
                            className="btn btn-light my-3" onClick={() => { setIsLatestFirst(!isLatestFirst) }}>
                            <i className="bi bi-arrow-down-up"></i>
                            {/* {isLatestFirst ? "Sort Oldest First" : "Sort Latest First"} */}
                        </button>
                    </div>
                </div>

                {/* submit new comment section  */}
                {showCommentBox && <>
                    <div className="d-flex justify-content-center py-4 font-merriweather">

                        {/* comment input form  */}
                        <form className='w-100 border border-3 border-beige bg-white rounded-2 px-2 mb-4'>

                            {/* commnet textarea/input box */}
                            <div className="w-100">
                                <label htmlFor="newComment"></label>
                                <textarea
                                    ref={textareaRef}
                                    className='form-control border border-0 pb-2'
                                    placeholder="Write your comment here"
                                    name="newComment"
                                    id="newComment"
                                    cols="15"
                                    value={newComment}
                                    onChange={(e) => { setNewComment(e.target.value) }}
                                >
                                </textarea>
                            </div>

                            {/* comment submission response & button */}
                            <div className='d-flex'>

                                {/* comment submission response  */}
                                {commentSuccess &&
                                    <p className='my-2 me-auto fw-bold p-1'>
                                        <i className="bi pe-1 bi-check-circle-fill"></i>
                                        Submitted Successfully
                                    </p>}

                                {/* comment submission button  */}
                                <button
                                    type='button'
                                    className='btn btn-sm btn-darkblue2 pt-1 my-2 ms-auto'
                                    onClick={() => { handleCommentSumbit() }}
                                > <i className="bi pe-1 bi-send"></i> Submit
                                </button>
                            </div>

                        </form>

                    </div>
                </>}

                {/* in case there are no comments, let the viewer know  */}
                {(existingComments.length < 1) && <>
                    <p className="text-center">
                        No discussion found.
                    </p>
                </>}


                {/* list all existing comments with sorting by posting time */}
                {(existingComments.length > 0) && sortedComments.map(comment => (
                    <div key={comment.id} className="border p-3 mb-3 rounded bg-white">
                        <div className='d-flex border-bottom mb-2'>
                            <p className='text-secondary me-auto'>
                                <strong className='text-uppercase font-merriweather'>{`${comment.user.first_name} ${comment.user.last_name}`}</strong>
                                <small className='px-2'>{comment.user.username}</small>
                                <small className="badge bg-beige mx-1 text-darkblue text-capitalize">{comment.user.role}</small>
                            </p>

                            {/* dropdown for edit and delete  */}
                            {(loggedUserId === comment.user.id) && <>
                                <div className="ms-auto">
                                    <div className="dropdown">
                                        <button
                                            className="btn border border-0 btn-light"
                                            type="button"
                                            id={`dropdownMenuButton-${comment.id}`}
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="bi bi-three-dots-vertical"> </i>
                                        </button>
                                        <ul
                                            className="dropdown-menu dropdown-menu-end bg-darkblue border shadow gap-1 p-2 rounded-3 mx-0 "
                                            aria-labelledby={`dropdownMenuButton-${comment.id}`}
                                        >
                                            <li className=''>
                                                <a
                                                    onClick={() => { handleEditComment(comment) }}
                                                    className="btn dropdown-item rounded-2 text-beige hover-bg-beige"
                                                > Edit
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    onClick={() => { handleDeleteComment(comment.id) }}
                                                    className="btn dropdown-item rounded-2 text-beige hover-bg-beige"
                                                > Delete
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </>}

                        </div>

                        {(editMyComment && (selectedCommentId === comment.id)) ?
                            <form>
                                <div className="w-100 bg-light border bg-beige">
                                    <textarea
                                        className='form-control bg-beige border border-0 pb-2 auto-resizable-textarea'
                                        placeholder="Write your comment here"
                                        name="text"
                                        id="text"
                                        value={text}
                                        cols={25}
                                        onFocus={(e) => { resizeTextarea(e.target) }}
                                        onChange={handleTextareaChange}
                                    // onChange={(e) => { setNewComment(e.target.value) }}
                                    >
                                    </textarea>
                                </div>
                            </form>
                            :
                            <p className='m-0 font-merriweather' style={{ whiteSpace: 'pre-line' }}>{comment.text}</p>
                        }

                        {(editMyComment && (selectedCommentId === comment.id)) ?

                            <div className='d-flex pt-2'>
                                <div className='btn-group gap-2 mx-auto'>
                                    <button className='btn btn-sm btn-darkblue2 px-3'> Save </button>
                                    <button className='btn btn-sm btn-light border' onClick={() => {setEditMyComment(!editMyComment)}}> Cancel </button>
                                </div>
                            </div>
                            :
                            <p className='text-sm-end m-0'>
                                <small className='text-secondary'>{customDateFormat(comment.created_at)}</small>
                            </p>
                        }

                    </div>
                ))}


            </div>
        </div>

    </>);
}


export default Discussion;

