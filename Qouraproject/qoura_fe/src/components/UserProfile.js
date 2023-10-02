import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from "jwt-decode";


function UserProfile() {
    const [userInfo, setUserInfo] = useState([]);
    const [questions, setQuestions] = useState([])
    const [topics, setTopics] = useState([])
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem('userData'));
    const accessToken = token.access;
    const decodedToken = jwtDecode(token.access);

    const userId = decodedToken?.user_id || null;
    async function info() {
        if (token && !token.expired) {
            console.log("reached here")
            try {
                const response = await axios.get(`http://localhost:8000/profile/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },

                });

                if (response.status == 200) {
                    console.log("first")
                    console.log(response)
                    setUserInfo(response.data.user_info);
                    setQuestions(response.data.asked_questions)
                    console.log(response.followed_topics)
                    setTopics(response.data.followed_topics)
                    setAnsweredQuestions(response.data.given_answers)
                    console.log(topics)
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        } else {

        }
    };
    const handleUpdateProfileClick = () => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        navigate("/update-profile");
    };
    useEffect(() => {
        info();
    }, []);



    if (userInfo.gender == 1) {
        userInfo.gender = "male";
    }
    else if (userInfo.gender == -1) {
        userInfo.gender = "female";
    }
    console.log(userInfo)
    console.log(topics)
    console.log(questions)
    console.log(answeredQuestions)
    return (
        <div className='container col-md-8'>
            <h2>User Profile</h2>
            <h3>User Info</h3>
            <img
                className='rounded float-left mb-2'
                src={userInfo.profile_picture}
                alt="Profile Picture"
                style={{ maxWidth: '10%', height: '3%' }}
            />
            <h6>Name: {userInfo.username}</h6>
            <h6>Email: {userInfo.email}</h6>
            <h6>Date of Birth:{userInfo.age}</h6>
            <h6>Gender: {userInfo.gender}</h6>
            <button className='btn btn-primary' onClick={() => handleUpdateProfileClick()}>
                Update Profile
            </button>
            <h2>Followed Topics</h2>
            <ul>
                {topics.map((topic) => (
                    <div key={topic.id} className="container d-flex p-2 border mb-2">
                        <div className="rounded-circle overflow-hidden mx-2 mr-2" style={{ width: '40px', height: '40px' }}>
                            <img src={topic.picture.replace("image/upload/", "")} alt={topic.topic_name} className="w-100 h-100" />
                        </div>
                        <div>
                            <h4>{topic.topic_name}</h4>
                            <h6 className='mb-1'>{topic.description}</h6>
                            <p className='mb-1'>Follwers:{topic.follower_count
                            }</p>
                        </div>
                    </div>

                ))}
            </ul>
            <h2>Your Questions:</h2>
            {questions.map((record) => (
                <ul>

                    <div key={record.question_id} className="container p-3 border mb-2">
                        <li className='mx-2'>
                            <h6>{record.question_statement}</h6>
                        </li>
                    </div>
                </ul>
            ))}
            <ul>
                <h2>Your Answers:</h2>
                {answeredQuestions.map((record) => (
                    <div key={record.question_id} className="container p-3 border mb-2">
                        <h6>{record.answer_statement}</h6>
                        <div className="d-flex align-items-center">

                            <i className="fa-regular fa-thumbs-up fa-lg"></i>{" "}
                            <span className="mx-2">{record.like_count}</span>
                            <i className="fa-regular fa-thumbs-down fa-lg"></i>{" "}
                            <span className="mx-2">{record.dislike_count}</span>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    )
};
export default UserProfile;
