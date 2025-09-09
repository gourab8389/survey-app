export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Survey Form Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create dynamic survey forms and collect responses easily
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-6">
              To access forms, use the direct form URLs or visit the admin dashboard to manage forms.
            </p>
            
            <div className="space-y-3">
              <a
                href="/admin"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Admin Dashboard
              </a>
              
              <p className="text-sm text-gray-500">
                Access individual forms using: /[form-id]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}