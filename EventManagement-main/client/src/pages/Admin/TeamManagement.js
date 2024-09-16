import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamManagement = () => {
    const [teams, setTeams] = useState([]);
    const [newTeam, setNewTeam] = useState({ teamName: '' });

    useEffect(() => {
        const fetchTeams = async () => {
            const res = await axios.get('/api/teams');
            setTeams(res.data);
        };
        fetchTeams();
    }, []);

    const handleChange = (e) => {
        setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
    };

    const addTeam = async () => {
        const res = await axios.post('/api/teams', newTeam);
        setTeams([...teams, res.data]);
        setNewTeam({ teamName: '' });
    };

    return (
        <div>
            <h2>Team Management</h2>
            <input name="teamName" value={newTeam.teamName} onChange={handleChange} placeholder="Team Name" />
            <button onClick={addTeam}>Create Team</button>
            <ul>
                {teams.map(team => (
                    <li key={team._id}>{team.teamName}</li>
                ))}
            </ul>
        </div>
    );
};

export default TeamManagement;
