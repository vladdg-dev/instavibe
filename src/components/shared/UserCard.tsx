import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Models } from 'appwrite';

const UserCard: React.FC<{ user: Models.Document }> = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[190px] w-[190px] border border-dark-4 rounded-2xl p-7">
      <div className="flex flex-col items-center mb-4">
        <Link to={`/profile/${user.$id}`}>
          <img
            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="creator"
            className="rounded-full w-12 lg:h-12 mb-2"
          />
        </Link>
        <p className="base-medium lg:body-bold text-light-1">{user.name}</p>
      </div>
      <Button className="shad-button_primary">Follow</Button>
    </div>
  );
};

export default UserCard;
