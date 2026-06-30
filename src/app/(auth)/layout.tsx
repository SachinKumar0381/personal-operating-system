export default function AuthLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950 dark:to-gray-900 p-4">
      {children}
    </div>
  );
}
