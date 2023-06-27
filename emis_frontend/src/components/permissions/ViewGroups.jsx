import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PermissionGroupList = () => {
  const [permissionGroups, setPermissionGroups] = useState([]);

  useEffect(() => {
    fetchPermissionGroups();
  }, []);

  const fetchPermissionGroups = async () => {
    try {
      const response = await axios.get('/api/permission-groups/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('accessToken')}`,
        },
      });

      setPermissionGroups(response.data);
    } catch (error) {
      console.error('Error fetching permission groups:', error);
    }
  };

  return (
    <div>
      <h2>Permission Groups</h2>
      <ul>
        {permissionGroups.map((group) => (
          <li key={group.id}>
            <h3>{group.name}</h3>
            <ul>
              {group.permissions.map((permission) => (
                <li key={permission}>{permission}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermissionGroupList;
