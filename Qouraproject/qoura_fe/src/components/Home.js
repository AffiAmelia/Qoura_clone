import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import axios from 'axios';
import _isEqual from "lodash/isEqual";


export const Home = () => {

    const token = JSON.parse(localStorage.getItem('userData'));

    const accessToken = token ? token.access : null;
    const refreshToken = token ? token.refreshToken : null;

    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken?.user_id || null;

    const [isLoading, setIsLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [answerVisibility, setAnswerVisibility] = useState({});
    const [answer, setAnswer] = useState("");
    const [likedQuestions, setLikedQuestions] = useState([]);
    const [likedAnswers, setLikedAnswers] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        setIsLoading(true);
        console.log("Bearer", accessToken)
        console.log(token)
        axios.get('http://localhost:8000/', {
            params: {
                user_id: userId,

            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },

        })
            .then(response => {
                console.log(response.data)
                setRecords(response.data);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [likedAnswers]);

    const fetchTopicData = (topicId) => {
        navigate(`/topic/${topicId}`)
    };
    const handleReaction = (questionId) => {
        setIsLoading(true)
        axios.post("http://localhost:8000/like-question/", {
            user: userId,
            question_id: questionId,
            type: Number(1), // 1 for like, -1 for dislike (you can update it to -1 for dislike later)
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                console.log(response.data.like_count)

                let recordArray = records
                console.log(records, recordArray, String(questionId))
                let record = recordArray.find(item => item.question_id === questionId)
                record.like_count = response.data.like_count
                record.dislike_count = response.data.dislike_count
                setRecords(recordArray)

                console.log(likedQuestions, 'question in like')

                const likedArr = likedQuestions
                let likedQuestionsNew = likedArr.filter(item => item.questionId === questionId && item.reaction_type != -1)
                likedQuestionsNew.push({ question: questionId, reaction_type: 1 })
                // If the request is successful, update the likedQuestions state with the liked question
                setLikedQuestions(likedQuestionsNew);

            })
            .catch((error) => {
                console.error("Error liking question:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    const handleDislike = (questionId) => {
        setIsLoading(true);
        axios.post("http://localhost:8000/like-question/", {
            user: userId,
            question_id: questionId,
            type: Number(-1),
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                console.log(response.data.like_count)

                let recordArray = records
                console.log(records, recordArray, String(questionId))
                let record = recordArray.find(item => item.question_id === questionId)
                record.like_count = response.data.like_count
                record.dislike_count = response.data.dislike_count
                setRecords(recordArray)

                console.log(likedQuestions, 'question in dislike')

                const likedArr = likedQuestions

                let likedQuestionsNew = likedArr.filter(item => item.questionId === questionId && item.reaction_type != 1)
                likedQuestionsNew.push({ question: questionId, reaction_type: -1 })
                setLikedQuestions(likedQuestionsNew);
            })
            .catch((error) => {
                console.error("Error liking question:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const isQuestionLiked = (questionId) => {

        return likedQuestions.some(
            (reaction) =>
                _isEqual(reaction.question, questionId) &&
                reaction.reaction_type === 1
        );

    }

    const isQuestionUnLiked = (questionId) =>
        likedQuestions.some(
            (reaction) =>
                _isEqual(reaction.question, questionId) &&
                reaction.reaction_type === -1
        );

    const toggleAnswer = (questionId) => {
        console.log(likedQuestions, 'in asnwer')
        setAnswerVisibility((prevVisibility) => ({
            ...prevVisibility,
            [questionId]: !prevVisibility[questionId],
        }));
    };

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };
    const handleAnswerLike = (answerId) => {
        setIsLoading(true);
        axios.post("http://localhost:8000/like-answer/", {
            user: userId,
            answer_id: answerId,
            type: 1,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                const updatedRecords = records.map((record) => {
                    if (record.id === answerId) {
                        return {
                            ...record,
                            like_count: response.data.like_count,
                            dislike_count: response.data.dislike_count,
                        };
                    }
                    return record;
                });
                setRecords(updatedRecords);

                const updatedLikedAnswers = likedAnswers.filter(
                    (item) => item.answerId !== answerId
                );
                updatedLikedAnswers.push({ answerId: answerId, reaction_type: 1 });
                setLikedAnswers(updatedLikedAnswers);
            })
            .catch((error) => {
                console.error("Error liking answer:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleAnswerDislike = (answerId) => {
        setIsLoading(true);
        axios.post("http://localhost:8000/like-answer/", {
            user: userId,
            answer_id: answerId,
            type: -1,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                const updatedRecords = records.map((record) => {
                    if (record.id === answerId) {
                        return {
                            ...record,
                            like_count: response.data.like_count,
                            dislike_count: response.data.dislike_count,
                        };
                    }
                    return record;
                });
                setRecords(updatedRecords);

                const updatedLikedAnswers = likedAnswers.filter(
                    (item) => item.answerId !== answerId
                );
                updatedLikedAnswers.push({ answerId: answerId, reaction_type: -1 });
                setLikedAnswers(updatedLikedAnswers);
            })
            .catch((error) => {
                console.error("Error disliking answer:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const isAnswerLiked = (answerId) => {
        return likedAnswers.some(
            (reaction) =>
                _isEqual(reaction.answerId, answerId) &&
                reaction.reaction_type === 1
        );
    };

    const isAnswerDisliked = (answerId) => {
        return likedAnswers.some(
            (reaction) =>
                _isEqual(reaction.answerId, answerId) &&
                reaction.reaction_type === -1
        );
    };
    const handleSubmitAnswer = (questionId) => {
        const answerData = {
            questionId: questionId,
            userId: userId,
            answer: answer,
        };
        setIsLoading(true);
        console.log("answer")
        const postAnswerWithToken = (accessToken) => {
            axios.post(`http://localhost:8000/questions/answer/`, answerData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then((response) => {
                    console.log(response);
                    const updatedRecords = records.map((record) => {
                        if (record.question_id === questionId) {
                            return {
                                ...record,
                                top_answers: [...record.top_answers, response.data.answer],
                            };
                        }
                        return record;
                    });

                    setRecords(updatedRecords);

                    setAnswer("");
                    setAnswerVisibility((prevVisibility) => ({
                        ...prevVisibility,
                        [questionId]: false,
                    }));
                })
                .catch((error) => {
                    console.error("Error saving answer:", error);
                    if (error.response && error.response.status === 401) {
                        axios.post('http://localhost:8000/token/refresh/', {
                            refresh: refreshToken,
                        })
                            .then((refreshResponse) => {
                                localStorage.setItem('userData', JSON.stringify({
                                    access: refreshResponse.data.access,
                                    refresh: refreshToken,
                                }));
                                postAnswerWithToken(refreshResponse.data.access);
                            })
                            .catch((refreshError) => {
                                console.error("Error refreshing token:", refreshError);
                            });
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };
        postAnswerWithToken(accessToken);
    };

    return (
        <div className="container col-md-8 margin-top">
            {isLoading && (
                <div className="loader">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <div>
                <h1>Home</h1>
            </div>
            {records.map((record) => (
                <div key={record.question_id} className="container p-3 border mb-2">
                    <Link to={`/topic/${record.topic_id}`} onClick={() => fetchTopicData(record.topic_id)}>
                        <h6>{record.topic_name}</h6>
                    </Link>
                    <h3>Q: {record.question_statement}</h3>
                    <div className="d-flex align-items-center">
                        {isQuestionLiked(record.question_id) && (
                            <button className="btn me-2 btn_disabled" disabled style={{ border: "none" }}>
                                <i className="fa-regular fa-thumbs-up fa-lg"></i>{" "}
                                <span className="mx-2">{record.like_count}</span>
                            </button>
                        )}
                        {!isQuestionLiked(record.question_id) && (
                            <button
                                className="btn me-2"
                                onClick={() => handleReaction(record.question_id)}
                            >
                                <i className="fa-regular fa-thumbs-up fa-lg"></i>{" "}
                                <span className="mx-2">{record.like_count}</span>
                            </button>
                        )}

                        {isQuestionUnLiked(record.question_id) && (
                            <button className="btn me-2 btn_disabled" disabled style={{ border: "none" }}>
                                <i className="fa-regular fa-thumbs-down fa-lg"></i>{" "}
                                <span className="mx-2">{record.dislike_count}</span>
                            </button>
                        )}

                        {!isQuestionUnLiked(record.question_id) && (
                            <button
                                className="btn me-2"
                                onClick={() => handleDislike(record.question_id)}
                            >
                                <i className="fa-regular fa-thumbs-down fa-lg"></i>{" "}
                                <span className="mx-2">{record.dislike_count}</span>
                            </button>
                        )}

                        <button
                            className="btn btn-primary my-2"
                            data-bs-toggle="collapse"
                            data-bs-target={`#answerCollapse-${record.question_id}`}
                            onClick={() => toggleAnswer(record.question_id)}
                        >
                            Answer
                        </button>
                    </div>

                    <div
                        className={`collapse ${answerVisibility[record.question_id] ? "show" : ""}`}
                        id={`answerCollapse-${record.question_id}`}
                    >
                        <div className="d-flex col-md-6">
                            <input
                                type="text"
                                className="form-control me-2"
                                placeholder="Your answer"
                                value={answer}
                                onChange={handleAnswerChange}
                            />
                            <button
                                className="btn btn-success"
                                onClick={() => handleSubmitAnswer(record.question_id)}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    <h4>Top Answers:</h4>
                    {record.top_answers.map((answer) => (
                        <div key={answer.id} className="border p-2 my-2 bg-white">
                            <p>Username:<strong>{answer.username}</strong></p>
                            <h6>Ans: {answer.answer_statement}</h6>
                            <button
                                className={`btn me-2 ${isAnswerLiked(answer.id) ? 'btn_disabled' : ''
                                    }`}
                                disabled={isAnswerLiked(answer.id)}
                                onClick={() => handleAnswerLike(answer.id)}
                            >
                                <i className="fa-regular fa-thumbs-up fa-lg"></i>{" "}
                                <span className="mx-2">{answer.like_count}</span>
                            </button>
                            <button
                                className={`btn me-2 ${isAnswerDisliked(answer.id) ? 'btn_disabled' : ''
                                    }`}
                                disabled={isAnswerDisliked(answer.id)}
                                onClick={() => handleAnswerDislike(answer.id)}
                            >
                                <i className="fa-regular fa-thumbs-down fa-lg"></i>{" "}
                                <span className="mx-2">{answer.dislike_count}</span>
                            </button>

                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Home;
