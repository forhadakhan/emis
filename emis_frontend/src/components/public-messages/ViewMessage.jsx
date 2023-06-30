/**
 * Calling from: PublicMessages.jsx
 * Calling To: 
 */

import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';
import { formatDateTime } from '../../utils/utils';


const ViewMessage = ({ message, setMessageComponent, breadcrumb }) => {
    const [isRead, setIsRead] = useState(message.is_read);
    const [isAnswered, setIsAnswered] = useState(message.is_answered);
    const [isDelete, setIsDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reply, setReply] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const accessToken = getAccessToken();


    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setMessageComponent('ViewMessage')}>
            <i className="bi bi-chat-right-quote"></i> Message Details
        </button>
    );

    const handleMarkAsRead = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        try {
            const updatedMessage = { ...message, is_read: true };
            await axios.patch(`${API_BASE_URL}/contact-message-update/${message.id}/`, updatedMessage, config);
            setIsRead(true);
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const handleMarkAsUnread = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        try {
            const updatedMessage = { ...message, is_read: false };
            await axios.patch(`${API_BASE_URL}/contact-message-update/${message.id}/`, updatedMessage, config);
            setIsRead(false);
        } catch (error) {
            console.error('Error marking message as unread:', error);
        }
    };

    const handleAnswered = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        try {
            const updatedMessage = { ...message, is_answered: true, is_read: true };
            await axios.patch(`${API_BASE_URL}/contact-message-update/${message.id}/`, updatedMessage, config);
            setIsAnswered(true);
        } catch (error) {
            console.error('Error marking message as answered:', error);
        }
    };

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleSendReply = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        const url = `${API_BASE_URL}/email/public-message-reply/`;

        const data = {
            message: message,
            reply: reply,
        };
        setIsLoading(true);
        axios.post(url, data, config)
            .then(response => {
                setReplyMessage(response.data.message);
                setReply('');
                setIsRead(true);
                setIsAnswered(true);
                handleAnswered();
                setIsLoading(false);
            })
            .catch(error => {
                setReplyMessage(error.response.data.message);
                console.error('Failed to send email:', error);
                setIsLoading(false);
            });
    };


    const handleMessageDelete = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        try {
            await axios.delete(`${API_BASE_URL}/contact-message-delete/${message.id}/`, config);
            setMessageComponent('MessageList')
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }

    return (
        <div className="px-4 py-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {updatedBreadcrumb.map((item, index) => (
                        <li className="breadcrumb-item" key={index}>{item}</li>
                    ))}
                </ol>
            </nav>

            <h1 className='my-4'>Message Details</h1>

            <div className='mw-750 mx-auto my-5'>

                <div className="d-flex justify-content-center my-4">

                    {!isRead ? (
                        <button className="btn btn-darkblue pt-1 mx-1" onClick={handleMarkAsRead}>
                            <i className="bi bi-envelope-open"></i> Mark as Read
                        </button>
                    ) : (
                        <button className="btn btn-beige pt-1 mx-1" onClick={handleMarkAsUnread}>
                            <i className="bi bi-envelope-fill"></i> Mark as Unread
                        </button>
                    )}

                    {!isAnswered ? (
                        <button className="btn btn-darkblue pt-1 mx-1" disabled >
                            <i className="bi bi-app"></i> Not Answered
                        </button>
                    ) : (
                        <button className="btn btn-darkblue pt-1 mx-1" disabled >
                            <i className="bi bi-check-square"></i> Answered
                        </button>
                    )}

                    <button className="btn btn-danger pt-1 mx-1" onClick={() => setIsDelete(!isDelete)} >
                        <i className="bi bi-trash3"></i> Delete
                    </button>

                </div>

                {isDelete &&
                    <div className="container d-flex align-items-center justify-content-center">
                        <div className="alert alert-info" role="alert">
                            <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                                <h6 className='text-center me-4 my-auto'>Are  you sure to <strong className='text-danger'>DELETE</strong> this message?</h6>
                                <button type="button" className="btn btn-danger" onClick={handleMessageDelete}> Yes </button>
                                <button type="button" className="btn btn-dark ms-2" onClick={() => setIsDelete(false)}> No </button>
                            </div>
                        </div>
                    </div>}

                <form action="">
                    <div className="py-5">
                        <div className="row mt-2">
                            <div className="col-md-12">
                                <h6 className='text-secondary px-3 fw-normal'>Sender Name</h6>
                                <p className="fs-5 bg-white p-3 rounded-3 border"> {message.name} </p>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-12">
                                <h6 className='text-secondary px-3 fw-normal'>Sender Email</h6>
                                <p className="fs-5 bg-white p-3 rounded-3 border"> {message.email} </p>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-12">
                                <h6 className='text-secondary px-3 fw-normal'>Received at</h6>
                                <p className="fs-5 bg-white p-3 rounded-3 border"> {formatDateTime(message.received_at)} </p>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-12">
                                <h6 className='text-secondary fw-normal px-3'>Message</h6>
                                <p className="fs-5 bg-white p-3 rounded-3 border"> {message.message} </p>
                            </div>
                        </div>
                    </div>
                </form>

                <h6 className='my-2 px-3'>Reply</h6>
                <textarea
                    rows={7}
                    cols={50}
                    value={reply}
                    required
                    onChange={handleReplyChange}
                    placeholder="Enter your reply here"
                    className='d-block w-100 my-2 rounded-3 p-3 border border-beige'
                ></textarea>
                {replyMessage && (
                    <div className="alert alert-info alert-dismissible fade show border border-darkblue" role="alert">
                        <i className="bi bi-check-square-fill"> </i> <strong> {replyMessage} </strong>
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setReplyMessage(false)} ></button>
                    </div>
                )}
                <button className="btn btn-darkblue d-block w-100 my-3" onClick={handleSendReply} disabled={reply.length < 2}>
                    {isLoading ? <>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="visually-hidden">Loading...</span>
                    </> :
                        'Send Reply'}
                </button>
            </div>
        </div>
    );
};

export default ViewMessage;
