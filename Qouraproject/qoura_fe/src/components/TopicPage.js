import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export const TopicPage = () => {
    const token = JSON.parse(localStorage.getItem('userData'));
    const accessToken = token.access;
    const { topicId } = useParams();
    const [topic, setTopic] = useState({});
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        console.log('App.js - topicId:', topicId);
        axios
            .get(`http://localhost:8000/topic/${topicId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setTopic(response.data.topic);
                setTotalFollowers(response.data.total_followers);
                setQuestions(response.data.questions);
                setPagination(response.data.pagination);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handlePageChange = (url) => {
        axios
            .get(url)
            .then((response) => {
                setQuestions(response.data.questions);
                setPagination(response.data.pagination);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    return (
        <div className="container margin-top">
            <div className="py-3">
                <h1>Topic: {topic.name}</h1>
                <p>Total Followers: {totalFollowers}</p>
            </div>
            <div>
                {questions.map((question) => (
                    <div key={question.id} className="container p-3 border mb-2">
                        <h3>Q: {question.question_statement}</h3>
                        <div className="d-flex ">
                            <div>Like Count: {question.like_count}</div>
                            <div>Dislike Count: {question.dislike_count}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination">
                {pagination.previous && (
                    <button
                        className="btn btn-primary"
                        onClick={() => handlePageChange(pagination.previous)}
                    >
                        Previous
                    </button>
                )}
                {pagination.next && (
                    <button
                        className="btn btn-primary"
                        onClick={() => handlePageChange(pagination.next)}
                    >
                        Next
                    </button>
                )}
            </div>
            <Link to="/home">Back to Home</Link>
        </div>
    );
};

export default TopicPage;
