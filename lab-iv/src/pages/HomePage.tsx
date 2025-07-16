import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { googleProvider, facebookProvider } from '../services/firebase/FirebaseConfig';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { Button } from '../components/atoms/Button';
import { ProviderLinks } from '../components/organisms/ProviderLinks';
import { AdvancedImage } from '@cloudinary/react';
import cld from '../services/cloudinary/CloudinaryConfig';
import { fill } from '@cloudinary/url-gen/actions/resize';

export const HomePage = () => {
  const { currentUser, signInWithProvider } = useAuth();
  const { posts, loading: postsLoading } = usePosts();

  const handleGoogleLogin = () => signInWithProvider(googleProvider);
  const handleFacebookLogin = () => signInWithProvider(facebookProvider);

  const getPublicId = (url: string) => {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    return parts.slice(uploadIndex + 2).join('/').replace(/\..+$/, '');
  };

  return (
    <AuthTemplate
      title="Welcome to Firebase Auth App"
      footerText={currentUser ? '' : "Don't have an account?"}
      footerLink="/signup"
      footerLinkText="Sign up with email"
      wide={!!currentUser}
    >
      {currentUser ? (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg">You are logged in as {currentUser.email}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Recent Posts</h2>
            
            {postsLoading ? (
              <div className="text-center py-4">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">You haven't created any posts yet</p>
                <Link to="/create-post">
                  <Button variant="primary">Create Your First Post</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.postId} className="border-b pb-4 last:border-b-0">
                    {post.imageUrl && (
                      <div className="w-full h-64 bg-gray-100 overflow-hidden">
                        <AdvancedImage
                          cldImg={cld.image(getPublicId(post.imageUrl)).resize(fill().width(800).height(400))}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{post.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <Link to={`/posts`} className="text-sm text-blue-600 hover:underline">
                        View All
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Link to="/profile" className="flex-1">
              <Button variant="secondary" className="w-full">
                Go to Profile
              </Button>
            </Link>
            <Link to="/create-post" className="flex-1">
              <Button variant="primary" className="w-full">
                Add New Post
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Login with Email
            </Button>
          </Link>
          <ProviderLinks
            onGoogleClick={handleGoogleLogin}
            onFacebookClick={handleFacebookLogin}
            showOr={true}
            className="mb-6"
          />
        </>
      )}
    </AuthTemplate>
  );
};
