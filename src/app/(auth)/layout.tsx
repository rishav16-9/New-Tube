interface layout {
  children: React.ReactNode;
}
const layout = ({ children }: layout) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default layout;
