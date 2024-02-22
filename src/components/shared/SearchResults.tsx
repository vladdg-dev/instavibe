import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostList from './GridPostList';

const SearchResults: React.FC<{
  isSearchFetching: boolean;
  searchedPosts: Models.DocumentList<Models.Document> | undefined;
}> = ({ isSearchFetching, searchedPosts }) => {
  if (isSearchFetching) return <Loader />;
  if (searchedPosts && searchedPosts.documents.length > 0)
    return <GridPostList posts={searchedPosts.documents} />;
  return (
    <p className="text-light-4 mt-10 text-center w-full">No posts found</p>
  );
};

export default SearchResults;
