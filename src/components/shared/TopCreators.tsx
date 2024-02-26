import UserCard from './UserCard';

const TopCreators = () => {
  return (
    <div className="hidden xl:flex flex-col w-[465px] bg-dark-2">
      <h2 className="flex h3-bold text-left mt-10 ml-7 w-full">Top Creators</h2>
      <div className="mt-7 ml-7">
        <UserCard />
      </div>
    </div>
  );
};

export default TopCreators;
