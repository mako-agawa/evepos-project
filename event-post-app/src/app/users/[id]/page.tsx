import UserShow from '@/components/users/UserShow';
import PostEvents from '@/components/events/PostEvents';
import ExpiredEvents from '@/components/events/ExpiredEvents';

const Page = () => {
  return (
    <div className="flex flex-col py-16 px-4">
      <UserShow />
      <PostEvents />
      <ExpiredEvents />
    </div>
  );
};

export default Page;
