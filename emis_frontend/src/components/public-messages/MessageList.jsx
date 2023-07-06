/**
 * Calling from: PublicMessages.jsx
 * Calling To: 
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { formatDateTime } from '../../utils/utils';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const MessageList = ({ setMessage, setMessageComponent, breadcrumb }) => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const accessToken = getAccessToken();
    const url = `${API_BASE_URL}/contact-messages/`;


    useEffect(() => {
        const fetchData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };
            try {
                const response = await axios.get(url, config);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching public messages:', error);
                setError('An error occurred while fetching public messages.');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setFilteredData(messages);
    }, [messages]);

    const handleViewMessage = (message) => {
        setMessage(message);
        setMessageComponent('ViewMessage');
    }

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = messages.filter(
            (message) =>
                message.name.toLowerCase().includes(keyword) ||
                message.message.toLowerCase().includes(keyword) ||
                message.received_at.toLowerCase().includes(keyword) ||
                (message.is_read && keyword === 'read') ||
                (!message.is_read && keyword === 'unread') ||
                (message.is_answered && keyword === 'answered') ||
                (!message.is_answered && keyword === 'not') ||
                (!message.is_answered && keyword === 'not answered')
        );
        setFilteredData(filteredResults);
    };

    const columns = [
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Message',
            selector: 'message',
            sortable: true,
            cell: (row) =>
                row.message.length > 18 ? `${row.message.slice(0, 18)}...` : row.message,
        },
        {
            name: 'Received at',
            selector: 'received_at',
            sortable: true,
            cell: (row) => (formatDateTime(row.received_at)),
        },
        {
            name: 'View',
            selector: 'is_read',
            cell: (row) => (<>
                <div className="mx-auto">
                    {(row.is_read ? <i className="bi bi-envelope-open mx-1"></i> : <i className="bi bi-envelope-fill mx-1"></i>)}
                    {(row.is_answered ? <i className="bi bi-check-square mx-1"></i> : <i className="bi bi-app mx-1"></i>)}
                    <button
                        type="button"
                        className="btn btn-beige text-darkblue p-0 px-1 mx-1"
                        onClick={() => handleViewMessage(row)}
                    >
                        <i className="bi bi-chat-right-quote"></i> Details
                    </button>
                </div>
            </>),
            // button: true,
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px',
                fontSize: '16px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                fontSize: '19px',
                backgroundColor: 'rgb(1, 1, 50)',
                color: 'rgb(238, 212, 132)',
                border: '1px solid rgb(238, 212, 132)',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                fontWeight: 'bold',
            },
        },
    };

    return (
        <div className="px-4 py-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {breadcrumb.map((item, index) => (
                        <li className="breadcrumb-item" key={index}>{item}</li>
                    ))}
                </ol>
            </nav>

            <h1 className='my-4'>Public Messages</h1>

            <div className="mb-3 me-5 input-group">
                <label htmlFor="filter" className="d-flex me-2 ms-auto p-1">
                    Filter:
                </label>
                <select id="filter" className="rounded bg-darkblue text-beige p-1" onChange={handleSearch}>
                    <option value="" selected>No Filter</option>
                    <option value="read">Read</option>
                    <option value="unread">Unread</option>
                    <option value="answered">Answered</option>
                    <option value="not answered">Not Answered</option>
                </select>
            </div>

            <div className="m-5">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            <div className="rounded-top-4">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    customStyles={customStyles}
                />
            </div>

            {error && (
                <div className="alert alert-warning alert-dismissible fade show border border-darkblue" role="alert">
                    <i className="bi bi-exclamation-octagon-fill"> </i> <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}

        </div>
    );
};

export default MessageList;
