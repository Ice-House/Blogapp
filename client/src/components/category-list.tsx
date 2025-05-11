import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@shared/schema";
import { Hash } from "lucide-react";

const CategoryList = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-600 dark:text-neutral-400">
            Failed to load categories
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories?.length > 0 ? (
          categories.map((category: Category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <a className="flex items-center justify-between px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-neutral-800 dark:text-neutral-200">
                <span className="flex items-center">
                  <Hash
                    size={16}
                    className="mr-2 text-neutral-500 dark:text-neutral-400"
                  />
                  {category.name}
                </span>
              </a>
            </Link>
          ))
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400 text-center py-2">
            No categories found
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryList;
