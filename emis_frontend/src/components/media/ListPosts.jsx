/** 
 * Calling from: 
 *              Home.jsx 
 *              ManageMedia.jsx
 */

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';
import { customDateFormat } from '../../utils/utils.js';

import ViewPost from './ViewPost';


const ListPosts = () => {
    const accessToken = getAccessToken();
    const [responseMsg, setResponseMsg] = useState('');
    const [showPost, setShowPost] = useState(false);
    const [selectedPost, setSelectedPost] = useState({});
    const [mediaList, setMediaList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 10; // Number of posts to show per page

    // Function to handle search, sort, and pagination changes
    const handleFiltersAndPagination = (search, sort, order, page) => {
        setSearchQuery(search);
        setSortBy(sort);
        setSortOrder(order);
        setCurrentPage(page);
    };

    // Sort the mediaList based on selected sorting field and order
    const sortedMediaList = useMemo(() => {
        const sortedList = [...mediaList];
        sortedList.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy].localeCompare(b[sortBy]);
            } else {
                return b[sortBy].localeCompare(a[sortBy]);
            }
        });
        return sortedList;
    }, [mediaList, sortBy, sortOrder]);


    // Paginate the sorted mediaList
    const paginatedMediaList = useMemo(() => {
        const startIndex = (currentPage - 1) * postsPerPage;
        return sortedMediaList.slice(startIndex, startIndex + postsPerPage);
    }, [currentPage, postsPerPage, sortedMediaList]);

    // send create/post request to backend through api 
    const fetchPosts = async () => {

        await axios.get(`${API_BASE_URL}/press/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                // Request success: handle the response from the backend
                setMediaList(response.data);
            })
            .catch(error => {
                // Request failed: handle the response from the backend
                setResponseMsg("ERROR: fetching posts failed.");
                console.error(error);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    // handle post details 
    const handleViewPost = (post) => {
        setSelectedPost(post);
        setShowPost(true);
    }

    // handle close for view post.
    const handleClose = (isUpdated) => { 
        setShowPost(false);

        if(isUpdated) {
            fetchPosts();
        }
    }


    return (
        <div>

            <div className="d-flex justify-content-between border-bottom py-3 my-4">
                {/* headings  */}
                <h4 className='text-secondary'>
                    <i className="bi bi-megaphone pe-2"></i>
                    Media Posts 
                    <button className='btn btn-sm btn-light mx-2' type='button' onClick={() => {fetchPosts()}}>
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                </h4>

                {/* Sort dropdown */}
                <div className="btn-group gap-1">
                    <button
                        className='btn btn-light'
                        onClick={() => { setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc') }}
                    >
                        <i className="bi bi-arrow-down-up"></i>
                    </button>
                    <select
                        className='form-select'
                        value={sortBy}
                        onChange={(e) => handleFiltersAndPagination(searchQuery, e.target.value, sortOrder, currentPage)}
                    >
                        <option value="created_at">Sort by Date</option>
                        <option value="title">Sort by Title</option>
                        <option value="category">Sort by Category</option>
                        {/* Add more sorting options as needed */}
                    </select>
                </div>
            </div>

            {/* post list  */}
            <div className="list-group font-merriweather shadow border border-beige">
                {paginatedMediaList.map(media => (
                    <button
                        className="list-group-item list-group-item-action border border-0"
                        key={media.id}
                        type='button'
                        onClick={() => {handleViewPost(media)}}
                    >
                        <h3 className='fw-bold'>{media.title}</h3>
                        <span className='small text-secondary'><i className="bi bi-calendar-event pe-1"></i> {customDateFormat(media.created_at)}</span>
                        <span className='badge bg-success mx-2'>{media.category}</span>
                    </button>
                ))}
            </div>

            {/* Pagination */}
            {/* <div className="my-5">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                    className='btn'
                        key={index + 1}
                        onClick={() => handleFiltersAndPagination(searchQuery, sortBy, sortOrder, index + 1)}
                        disabled={index + 1 === currentPage}
                    >
                        {index + 1}
                    </button>
                ))}
            </div> */}


            {showPost && <>
                <ViewPost
                    selectedPost={selectedPost}
                    show={showPost}
                    handleClose={handleClose}
                />
            </>}
        </div>
    );
};

export default ListPosts;

