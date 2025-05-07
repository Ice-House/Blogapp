import { Helmet } from "react-helmet";
import PostEditor from "@/components/post-editor";

const CreatePost = () => {
  return (
    <>
      <Helmet>
        <title>Create New Post | Blogfolio</title>
        <meta name="description" content="Create a new blog post and share your knowledge with the world." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PostEditor />
      </div>
    </>
  );
};

export default CreatePost;
