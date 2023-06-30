/**
 * Calling from: Activity.jsx
 * Calling To: MessageList.jsx; ViewMessage.jsx;
 */

import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import ViewMessage from './ViewMessage';


const PublicMessages = ({ setActiveComponent, breadcrumb }) => {
    const [message, setMessage] = useState([]);
    const [messageComponent, setMessageComponent] = useState('');


    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setMessageComponent('MessageList')}>
            <i className="bi bi-chat-right-quote-fill"></i> Public Messages
        </button>
    );

    const renderComponent = () => {
        switch (messageComponent) {
            case 'MessageList':
                return <MessageList setMessage={setMessage} setMessageComponent={setMessageComponent} breadcrumb={updatedBreadcrumb} />
            case 'ViewMessage':
                return <ViewMessage message={message} setMessageComponent={setMessageComponent} breadcrumb={updatedBreadcrumb} />
            default:
                return <MessageList setMessage={setMessage} setMessageComponent={setMessageComponent} breadcrumb={updatedBreadcrumb} />
        }
    }


    return (
        <div>
            
            <div>
                {renderComponent()}
            </div>
        </div>
    );
};

export default PublicMessages;
