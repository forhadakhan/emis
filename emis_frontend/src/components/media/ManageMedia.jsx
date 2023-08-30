/**
 * Calling from: ManagerialActivity.jsx
 * Calling to: CreatePost.jsx; ListPosts.jsx;
 */


import React, { useState } from 'react';

import CreatePost from './CreatePost';
import ListPosts from './ListPosts';


const ManageMedia = ({ setActiveComponent, breadcrumb }) => {
    const [error, setError] = useState('');
    const [showComponent, setShowComponent] = useState('CreatePost');


    // add current component to the breadcrumb list 
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageAcademicCalendar')} type='button'>
            <i className="bi bi-megaphone"></i> Manage Media
        </button>
    );


    const renderComponent = () => {
        switch (showComponent) {
            case 'CreatePost':
                return <CreatePost />
            case 'ListPosts':
                return <ListPosts />
            default:
                return ''
        }
    }


    return (
        <>
            {/* show breadcrumb list  */}
            <div className="">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {updatedBreadcrumb.map((item, index) => (
                            <li className="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ol>
                </nav>
            </div>


            {/* show page title  */}
            <h2 className="text-center m-5 px-2 font-merriweather">
                <i className="bi bi-megaphone pe-3"></i> Manage Media
            </h2>


            {/* show error message if any  */}
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}


            {/* show action tabs/links  */}
            <div className="">
                <ul className="mb-5 nav nav-tabs px-sm-5 gap-1 justify-content-center">

                    {/* create a new post */}
                    <li className="nav-item text-darkblue">
                        <a
                            className={`py-1 nav-link ${showComponent === 'CreatePost' ? 'active' : 'bg-beige'}`}
                            href="#"
                            title='Manage activity for a specific date'
                            onClick={() => { setShowComponent('CreatePost') }}
                        >
                            <span className="text-darkblue">New Post</span>
                        </a>
                    </li>

                    {/* view posts list  */}
                    <li className="nav-item">
                        <a
                            className={`py-1 nav-link ${showComponent === 'ListPosts' ? 'active' : 'bg-beige'}`}
                            href="#"
                            title='View all calendar activities of a month/year'
                            onClick={() => { setShowComponent('ListPosts') }}
                        >
                            <span className="text-darkblue">List Posts</span>
                        </a>
                    </li>
                </ul>
            </div>


            {/* render selected component  */}
            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


export default ManageMedia;

