"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";
import FilterCarousel from "@/components/filter-corousel";
import { useRouter } from "next/navigation";

interface CategoriesSectionProps {
  categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <Suspense fallback={<CategorySelection />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CategoriesSuspenseSection categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySelection = () => {
  return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
};

const CategoriesSuspenseSection = ({ categoryId }: CategoriesSectionProps) => {
  const router = useRouter();
  const [categories] = trpc.category.getMany.useSuspenseQuery();
  const data = categories.map((categories) => ({
    value: categories.id,
    label: categories.name,
  }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }
    router.push(url.toString());
  };
  
  return <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />;
};

export default CategoriesSection;
