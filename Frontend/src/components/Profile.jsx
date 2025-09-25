const Profile = () => {
  return (
    <div className="main-content ml-[30px] w-[95%] leading-none">
      <div className="px-4 py-4">
        <h2 className="mb-14 text-4xl text-black font-bold">Profile</h2>

        <div className="mx-auto max-w-2xl border border-gray-400 rounded-2xl p-6 shadow-[0_0_20px_10px_rgba(0,0,25,0.25)]">
          <div className="mb-6 text-center ">
            <img
              src="/maria.jpg"
              alt="Profile"
              className="mx-auto mb-3 h-30 w-30 rounded-full object-cover border border-gray-900"
              style={{ width: "120px", height: "120px" }}
            />
            <h4 className="text-xl font-semibold text-black">Maria D Souza</h4>
            <p className="text-sm text-gray-800">HR Manager</p>
          </div>

          <div className="pl-[10%] grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-black">Email</label>
              <p className="text-gray-800">maria.dsouza@company.com</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-black">Phone</label>
              <p className="text-gray-800">+1 (555) 123-4567</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-black">Department</label>
              <p className="text-gray-800">Human Resources</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-black">Employee ID</label>
              <p className="text-gray-800">HR001</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-black">Join Date</label>
              <p className="text-gray-800">January 15, 2020</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-black">Location</label>
              <p className="text-gray-800">New York, NY</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button className="mr-2 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 border hover:border-gray-900">
              Edit Profile
            </button>
            <button className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-100 transition hover:bg-gray-100 border hover:border-gray-700 hover:text-gray-800">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
