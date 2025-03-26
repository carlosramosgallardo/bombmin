module.exports = {
  reactStrictMode: true,
};

# app/not-found.js
export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl">Page Not Found (404)</h1>
    </div>
  );
}

