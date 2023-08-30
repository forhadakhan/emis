/** 
 * Calling from: 
 *              ListPosts.jsx
 */

import React, { useState } from "react";
import { customDateFormat } from "../../utils/utils.js";
import { getAccessToken, getUserId } from "../../utils/auth.js";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import EditPost from "./EditPost.jsx";

const ViewPost = ({ selectedPost, show, handleClose }) => {
    const [post, setPost] = useState(selectedPost);
    const [content, setContent] = useState(post ? post.content : "");
    const [authorFullName, setAuthorFullName] = useState(`${post.author.first_name} ${post.author.middle_name} ${post.author.last_name}`);
    const [isEdit, setIsEdit] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [authorID, setAuthorID] = useState(post.author.id);
    const userID = getUserId();

    const postUpdated = (data) => {
        setIsEdit(false);
        if (data) {
            console.log(data);
            setPost(data);
            setContent(data.content);
            setIsUpdated(true);
            setAuthorID(data.author);
        }
    };

    return (
        <>
            {/* edit modal  */}
            <div className="bg-blur">
                <div
                    className={`modal ${show ? "show" : ""}`}
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: show ? "block" : "none" }}
                >
                    <div
                        className="modal-dialog modal-fullscreen"
                        role="document"
                    >
                        <div className="modal-content font-merriweather border border-beige">
                            {/* modal title  */}
                            <div className="modal-header bg-darkblue text-beige">
                                {/* post category */}
                                <h5 className="modal-title fs-4 text-capitalize">
                                    <i className="bi bi-megaphone"></i>
                                    <span className="bg-beige text-darkblue mx-2 px-2 rounded">
                                        {post ? post.category : "[none]"}{" "}
                                    </span>
                                </h5>
                                {/* modal close button  */}
                                <button
                                    type="button"
                                    className="close btn bg-beige border-2 border-beige"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => {handleClose(isUpdated)}}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            {/* modal body  */}
                            <div className="modal-body">
                                <div className="container">
                                    {post && (
                                        <>
                                            {!isEdit && (
                                                <div>
                                                    {/* post title  */}
                                                    <h1 className=" display-2 fw-bold">
                                                        {post.title}
                                                    </h1>
                                                    {/* post author  */}
                                                    <span className="small text-secondary d-block">
                                                        <i className="bi bi-person-circle pe-2"></i>
                                                        {authorFullName}
                                                    </span>
                                                    {/* post time  */}
                                                    <span className="small text-secondary d-block">
                                                        <i className="bi bi-calendar-event pe-1"></i>{" "}
                                                        {customDateFormat(
                                                            post.created_at
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {/* edit button  */}
                                            {userID === authorID && (
                                                <p className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-light"
                                                        onClick={() => {
                                                            setIsEdit(!isEdit);
                                                        }}
                                                    >
                                                        <i className="bi bi-pen pe-2"></i>
                                                        {isEdit
                                                            ? "Cancel edit"
                                                            : "Edit"}
                                                    </button>
                                                </p>
                                            )}

                                            {/* update message  */}
                                            {isUpdated && (
                                                <>
                                                    <div
                                                        class="alert mt-4 alert-warning alert-dismissible fade show"
                                                        role="alert"
                                                    >
                                                        Post Updated
                                                        Successfully.
                                                        <button
                                                            type="button"
                                                            class="btn-close"
                                                            data-bs-dismiss="alert"
                                                            aria-label="Close"
                                                            onClick={() => {
                                                                setIsUpdated(
                                                                    !isUpdated
                                                                );
                                                            }}
                                                        ></button>
                                                    </div>
                                                </>
                                            )}

                                            {/* post  */}
                                            <div className="my-5">
                                                {isEdit ? (
                                                    <EditPost
                                                        post={post}
                                                        postUpdated={
                                                            postUpdated
                                                        }
                                                    />
                                                ) : (
                                                    <ReactQuill
                                                        value={content}
                                                        modules={{
                                                            toolbar: false,
                                                        }}
                                                        readOnly={true}
                                                        theme="snow"
                                                    />
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ViewPost;
