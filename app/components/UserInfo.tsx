const UserInfo = ({ user }: { user: any }) => {
    return (
        <div className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <p><strong>Username:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>College ID:</strong> {user.clgId}</p>
            {/* Add more user details if needed */}
        </div>
    );
};

export default UserInfo;
