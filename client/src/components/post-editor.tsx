import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsertPost, Category, Tag } from "@shared/schema";
import { renderMarkdown } from "@/lib/markdown";
import { Loader2, FileUp, Image } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string()
    .min(5, "Slug must be at least 5 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  coverImage: z.string().url("Cover image must be a valid URL").optional(),
  author: z.string().min(2, "Author name must be at least 2 characters"),
  categoryId: z.number().nullable().optional(),
  tags: z.array(z.number()).optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

const PostEditor = () => {
  const [previewContent, setPreviewContent] = useState("");
  const [currentTab, setCurrentTab] = useState("write");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [_, navigate] = useLocation();
  
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ["/api/tags"],
  });
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: "",
      author: "",
      categoryId: null,
      tags: [],
    },
  });
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
  };
  
  const watchTitle = form.watch("title");
  const watchContent = form.watch("content");
  
  // Update slug when title changes
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    
    if (!form.getValues("slug") || form.getValues("slug") === generateSlug(form.getValues("title"))) {
      form.setValue("slug", generateSlug(title));
    }
  };
  
  // Update preview when content changes or tab changes
  const updatePreview = () => {
    setPreviewContent(renderMarkdown(watchContent));
    setCurrentTab("preview");
  };
  
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to upload file");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const imageUrl = `${window.location.origin}${data.url}`;
      form.setValue("coverImage", imageUrl);
      toast({
        title: "Image uploaded",
        description: "Cover image has been uploaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your image.",
        variant: "destructive",
      });
    },
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    uploadMutation.mutate(formData);
  };
  
  const postMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      const res = await apiRequest("POST", "/api/posts", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Post published",
        description: "Your post has been published successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      navigate(`/post/${data.slug}`);
    },
    onError: (error) => {
      toast({
        title: "Publication failed",
        description: error.message || "There was an error publishing your post.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: PostFormValues) => {
    postMutation.mutate(data);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Create New Blog Post</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Post title" 
                          {...field} 
                          onChange={onTitleChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="post-url-slug" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief summary of your post (shows in cards and previews)" 
                          className="h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value) || null)} 
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category: Category) => (
                              <SelectItem 
                                key={category.id} 
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag: Tag) => (
                        <Button
                          key={tag.id}
                          type="button"
                          variant={field.value?.includes(tag.id) ? "default" : "outline"}
                          onClick={() => {
                            const currentValue = field.value || [];
                            if (currentValue.includes(tag.id)) {
                              field.onChange(currentValue.filter(id => id !== tag.id));
                            } else {
                              field.onChange([...currentValue, tag.id]);
                            }
                          }}
                          size="sm"
                        >
                          {tag.name}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <FormControl>
                          <Input 
                            placeholder="Image URL" 
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadMutation.isPending}
                        >
                          {uploadMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <FileUp className="h-4 w-4 mr-2" />
                          )}
                          Upload
                        </Button>
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                      
                      {field.value && (
                        <div className="rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-700 h-40">
                          <img 
                            src={field.value} 
                            alt="Cover preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/600x400/EEE/999?text=Image+Preview";
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                      <TabsList className="grid grid-cols-2 mb-2">
                        <TabsTrigger value="write">Write</TabsTrigger>
                        <TabsTrigger 
                          value="preview" 
                          onClick={updatePreview}
                        >
                          Preview
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="write" className="mt-0">
                        <FormControl>
                          <Textarea 
                            placeholder="Write your post content in Markdown..." 
                            className="font-mono min-h-[400px] resize-y"
                            {...field} 
                          />
                        </FormControl>
                      </TabsContent>
                      <TabsContent value="preview" className="mt-0">
                        <div className="border rounded-md p-4 min-h-[400px] prose dark:prose-invert max-w-none">
                          {previewContent ? (
                            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                          ) : (
                            <div className="text-neutral-500 dark:text-neutral-400 flex flex-col items-center justify-center h-full">
                              <p>No content to preview</p>
                              <Button 
                                variant="ghost" 
                                onClick={() => setCurrentTab("write")}
                                className="mt-2"
                              >
                                Start writing
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                      Supports Markdown formatting (headers, lists, links, code blocks, etc.)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-blue-600"
                  disabled={postMutation.isPending}
                >
                  {postMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Post"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostEditor;
