import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { UserCircle, ThumbsUp, Reply } from "lucide-react";

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
}

const commentSchema = z.object({
  authorName: z.string().min(2, "Name must be at least 2 characters"),
  authorEmail: z.string().email("Invalid email address"),
  content: z.string().min(5, "Comment must be at least 5 characters"),
  parentId: z.number().nullable().optional(),
});

type CommentFormValues = z.infer<typeof commentSchema>;

const CommentSection = ({ postId, comments }: CommentSectionProps) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      authorName: "",
      authorEmail: "",
      content: "",
      parentId: null,
    },
  });
  
  const commentMutation = useMutation({
    mutationFn: async (data: CommentFormValues) => {
      const res = await apiRequest("POST", `/api/posts/${postId}/comments`, {
        ...data,
        postId,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Comment submitted",
        description: "Your comment has been posted successfully.",
      });
      form.reset();
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}`] });
    },
    onError: (error) => {
      toast({
        title: "Failed to post comment",
        description: error.message || "There was an error posting your comment.",
        variant: "destructive",
      });
    },
  });
  
  const handleReply = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    if (replyingTo !== commentId) {
      form.setValue("parentId", commentId);
    } else {
      form.setValue("parentId", null);
    }
  };
  
  const onSubmit = (data: CommentFormValues) => {
    commentMutation.mutate(data);
  };
  
  // Group comments by parent
  const topLevelComments = comments.filter(comment => !comment.parentId);
  const commentReplies = comments.filter(comment => comment.parentId);
  
  const getRepliesForComment = (commentId: number) => {
    return commentReplies.filter(reply => reply.parentId === commentId);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
        Comments ({comments.length})
      </h3>
      
      {/* Comment Form */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
        <h4 className="font-medium text-neutral-900 dark:text-white mb-4">Leave a comment</h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-blue-600"
                disabled={commentMutation.isPending}
              >
                {commentMutation.isPending ? "Submitting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {topLevelComments.length > 0 ? (
          topLevelComments.map(comment => (
            <div key={comment.id} className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <UserCircle size={40} className="text-neutral-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-neutral-900 dark:text-white">{comment.authorName}</h4>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                    {comment.content}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <button 
                      className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center"
                      onClick={() => handleReply(comment.id)}
                    >
                      <Reply size={16} className="mr-1" />
                      {replyingTo === comment.id ? "Cancel" : "Reply"}
                    </button>
                  </div>
                  
                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 pl-4 border-l-2 border-neutral-200 dark:border-neutral-700">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="authorName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="authorEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your email" type="email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reply</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Your reply..." 
                                    className="min-h-[80px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end">
                            <Button 
                              type="submit" 
                              className="bg-primary hover:bg-blue-600"
                              disabled={commentMutation.isPending}
                            >
                              {commentMutation.isPending ? "Submitting..." : "Post Reply"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}
                  
                  {/* Nested Replies */}
                  {getRepliesForComment(comment.id).length > 0 && (
                    <div className="mt-4 space-y-4">
                      {getRepliesForComment(comment.id).map(reply => (
                        <div key={reply.id} className="border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 ml-2">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <UserCircle size={32} className="text-neutral-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-neutral-900 dark:text-white">{reply.authorName}</h5>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm text-center">
            <p className="text-neutral-600 dark:text-neutral-400">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
