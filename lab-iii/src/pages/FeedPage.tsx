import { PostsList } from '../components/organisms/PostsList';
import { AuthTemplate } from '../components/templates/AuthTemplate';

export const FeedPage = () => {
  return (
    <AuthTemplate title="Posts" wide>
      <div className="space-y-8">
        <PostsList />
      </div>
    </AuthTemplate>
  );
};
