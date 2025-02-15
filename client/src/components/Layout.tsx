const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4">Sidebar</aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
