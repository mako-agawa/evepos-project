import UserShow from '@/components/users/userPage/UserShow';
import PostEvents from '@/components/events/eventPages/PostEvents';
import ExpiredEvents from '@/components/events/eventPages/ExpiredEvents';

const Page = () => {
  return (
    <div className="flex flex-col py-16 px-4">
      <UserShow/>
      <PostEvents />
      <ExpiredEvents />
    </div>
  );
};

export default Page;
