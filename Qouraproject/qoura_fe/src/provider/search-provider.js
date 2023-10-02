import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
    const [searchResult, setSearchResult] = useState([]);

    return (
        <SearchContext.Provider value={{ searchResult, setSearchResult }}>
            {children}
        </SearchContext.Provider>
    );
};

const useSearchResult = () => {
    const { searchResult, setSearchResult } = useContext(SearchContext);
    return { searchResult, setSearchResult };
};

export { SearchProvider, useSearchResult };







