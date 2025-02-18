import CategoriesSection from "@/modules/home/ui/sections/categories-section";

interface HomeViewProps {
  categoryId?: string;
}

const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className="max-w-[2400px] px-4 mx-auto mb-10 pb-2.5 flex flex-col gap-y-6">
      <CategoriesSection categoryId={categoryId} />
    </div>
  );
};

export default HomeView;
