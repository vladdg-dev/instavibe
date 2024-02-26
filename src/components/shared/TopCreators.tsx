import { useGetUsers } from '@/lib/react-query/queriesAndMutations';
import Loader from './Loader';
import UserCard from './UserCard';

const TopCreators = () => {
  const { data: users, isLoading: isUserLoading } = useGetUsers(10);

  return (
    <div className="hidden xl:flex flex-col w-[465px] bg-dark-2">
      <h2 className="flex h3-bold text-left mt-10 ml-7 w-full">Top Creators</h2>
      <div className="grid grid-cols-2 gap-8 mt-7 ml-7">
        {isUserLoading ? (
          <Loader />
        ) : (
          users?.documents.map(user => <UserCard user={user} />)
        )}
      </div>
    </div>
  );
};

export default TopCreators;
