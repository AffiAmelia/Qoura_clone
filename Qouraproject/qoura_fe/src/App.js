import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Home } from './components/Home';
import Layout from "./components/Layout";
import SearchResults from "./components/SearchResults";
import { SearchProvider } from './provider/search-provider';
import AddTopicForm from "./components/AddTopicForm";
import Topic from "./components/Topic";
import UserProfile from "./components/UserProfile"
import UpdateProfile from "./components/UpdateProfile";
import AddQuestionForm from './components/AddQuestion';
import TopicPage from "./components/TopicPage";
import PrivateRoutes from "./utils/PrivateRoutes";
import PageNotFound from './utils/PageNotFound';
import BaseUser from './utils/BaseUser';
import ChangePassword from "./components/ChangePassword";


function App() {

  return (
    <div>
      <SearchProvider>
        <Routes>
          <Route element={<BaseUser />}>
            <Route path="/" element={<Login />} />
          </Route>

          <Route element={<PrivateRoutes />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/add-topic" element={<AddTopicForm />} />
              <Route path="/topic" element={<Topic />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/add-question" element={<AddQuestionForm />} />
              <Route path="/topic/:topicId" element={<TopicPage />} />
              <Route path="/upate-password" element={<ChangePassword />} />
            </Route>

          </Route>

          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </SearchProvider>
    </div>
  );
}

export default App;
