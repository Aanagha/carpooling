const UserInfo = ({ user }: { user: any }) => {
    return (
        <div className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <p><strong>Username:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          
        </div>
    );
};

export default UserInfo;
