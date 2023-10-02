import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from "jwt-decode";

function TopicList() {
    const token = JSON.parse(localStorage.getItem('userData'));
    const accessToken = token.access;

    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken?.user_id || null;
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/topics/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .finally(() => {
                    setIsLoading(false);
                });
            setTopics(response.data);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }

    };

    const toggleFollow = (topicId) => {
        const currentUserId = userId;

        axios
            .post(`http://localhost:8000/topics/unfollow/${topicId}/`, null, {
                params: {
                    userId: currentUserId,
                }
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                const updatedTopics = topics.map((topic) => {
                    if (topic.topic_id === topicId) {
                        return {
                            ...topic,
                            is_followed: response.data.is_followed,
                            follower_count: response.data.follower_count,
                        };
                    }
                    return topic;
                });
                setTopics(updatedTopics);
            })
            .catch((error) => {
                console.error('Error toggling follow:', error);
            });
    };

    return (
        <div className='container'>
            <h2>Topics</h2>
            {topics.map((topic) => (
                <div key={topic.topic_id} className='container d-flex p-2 border mb-2'>
                    <div className='rounded-circle overflow-hidden mx-2 mr-2' style={{ width: '40px', height: '40px' }}>
                        <img src={topic.picture.replace('image/upload/', '')} alt={topic.topic_name} className='w-100 h-100' />
                    </div>
                    <div>
                        <h4>{topic.topic_name}</h4>
                        <h6 className='mb-1'>{topic.description}</h6>
                        <p className='mb-1'>Followers: {topic.follower_count}</p>
                    </div>
                    <div>
                        <button
                            className={`btn ml-auto mx-2 d-flex align-items-center ${topic.is_followed ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => toggleFollow(topic.topic_id)}
                        >
                            {topic.is_followed ? '-' : '+'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TopicList;
