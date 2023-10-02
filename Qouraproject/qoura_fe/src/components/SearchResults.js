import React from "react";
import { useLocation } from "react-router-dom";
import { useSearchResult } from "../provider/search-provider";


const SearchResults = () => {
    const token = JSON.parse(localStorage.getItem('userData'));

    const location = useLocation();
    const { searchResult, setSearchResult } = useSearchResult();



    return (
        <div className="container col-md-6">
            <div className="py-3">
                <h1>Search Results</h1>
            </div>
            <div>
                <div>
                    <h2 className="mb-3">Search Results:</h2>
                    <div className="list-group">
                        {searchResult && searchResult.map((question, index) => (
                            <div className="list-group-item mb-3" key={index}>
                                <h3 className="mb-1">{question?.question_statement}</h3>
                                <p className="mb-0">Topic: {question?.topic_name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        </div>
    );
};

export default SearchResults;
