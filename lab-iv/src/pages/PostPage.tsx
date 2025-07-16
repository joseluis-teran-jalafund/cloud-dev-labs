import { PostForm } from '../components/organisms/PostForm';
import { AuthTemplate } from '../components/templates/AuthTemplate';

export const PostPage = () => {
  return (
    <AuthTemplate title="Firebase Auth App" wide>
      <div className="space-y-8">
        <PostForm />
      </div>
    </AuthTemplate>
  );
};
