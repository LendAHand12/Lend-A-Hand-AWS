const ErrorPage = () => {
  return (
    <div className="bg-white">
      <div className="flex flex-col justify-center items-center mt-10">
        <h1 className="text-8xl font-bold text-gray-800">404</h1>
        <p className="text-4xl font-medium text-gray-800">Page Not Found</p>
        <a href="/" className="mt-4 text-xl text-primary hover:underline">
          Go back home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
