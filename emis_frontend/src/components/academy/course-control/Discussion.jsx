/**
 * Calling from: 
 *              ManageTeacherCourses.jsx
 *              ControlOfferedCourse.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import { getAccessToken } from '../../../utils/auth';
import { customDateFormat } from '../../../utils/utils';
import API_BASE_URL from '../../../utils/config';
import axios from 'axios';


const Discussion = ({ courseOffer }) => {
    const accessToken = getAccessToken();
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(true);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentSuccess, setCommentSuccess] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLatestFirst, setIsLatestFirst] = useState(true);


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

            </div>
        </div>

    </>);
}


export default Discussion;

