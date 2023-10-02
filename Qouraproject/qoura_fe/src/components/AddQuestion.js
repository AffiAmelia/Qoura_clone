import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'select2';
import jwtDecode from "jwt-decode";


const AddQuestionForm = () => {
    const token = JSON.parse(localStorage.getItem('userData'));
    const accessToken = token.access;

    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken?.user_id || null;
    const [isLoading, setIsLoading] = useState(false);
    const [questionStatement, setQuestionStatement] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [allTopics, setAllTopics] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef();

    useEffect(() => {
        setIsLoading(true);
        axios
            .get('http://localhost:8000/topics/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setAllTopics(response.data);
            })
            .catch((error) => {
                console.error('Error fetching topics:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, []);

    useEffect(() => {
        if (allTopics.length > 0) {
            $(selectRef.current).select2();
        }
    }, [allTopics]);

    const handleAddQuestion = () => {
        setError('');
        setMessage('');
        setIsLoading(true);
        axios
            .post('http://localhost:8000/add_question_to_topic/', {
                question_statement: questionStatement,
                topic_ids: selectedTopics.map(topic => topic.topic_id),
                user_id: userId,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setMessage(response.data.message);
                setQuestionStatement('');
                setSelectedTopics([]);
            })
            .catch((error) => {
                setError('Error adding question to topics.');
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRemoveSelectedTopic = (topicId) => {
        setSelectedTopics(selectedTopics.filter(topic => topic.topic_id !== topicId));
    };


    return (
        <div className="container mt-5">
            <h2>Add Question to Topics</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <div className="form-group">
                <label htmlFor="questionStatement">Question Statement:</label>
                <input
                    type="text"
                    id="questionStatement"
                    className="form-control"
                    value={questionStatement}
                    onChange={(e) => setQuestionStatement(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="topicIds">Select Topics:</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for topics"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select
                    ref={selectRef}
                    id="selectedTopics"
                    name="selectedTopics"
                    className="form-control"
                    multiple
                    value={selectedTopics.map(topic => topic.topic_id)}
                    onChange={(e) => {
                        const selectedOptions = [...e.target.selectedOptions];
                        setSelectedTopics(selectedOptions.map(option => ({ topic_id: option.value, topic_name: option.label })));
                    }}
                >
                    {allTopics.map(topic => (
                        <option
                            key={topic.topic_id}
                            value={topic.topic_id}
                            selected={selectedTopics.some(selectedTopic => selectedTopic.topic_id === topic.topic_id)}
                        >
                            {topic.topic_name}
                        </option>
                    ))}
                </select>
                <div className="mt-2">
                    {selectedTopics.map(topic => (
                        <span
                            key={topic.topic_id}
                            className="badge badge-pill badge-primary mr-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRemoveSelectedTopic(topic.topic_id)}
                        >
                            {topic.topic_name} <span aria-hidden="true">×</span>
                        </span>
                    ))}
                </div>
            </div>
            <button className="btn btn-primary" onClick={handleAddQuestion}>Add Question</button>
        </div>
    );
};

export default AddQuestionForm;
