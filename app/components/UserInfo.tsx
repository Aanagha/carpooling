const UserInfo = ({ user }: { user: any }) => {
    return (
        <div className="flex  relative items-center justify-center w-full ">
  
  <div className="rounded-xl overflow-hidden relative text-center p-4  items-center flex flex-col   backdrop-blur-2xl bg-white/20">
    <div className="text-gray-500 ">
      <svg className="w-16 h-16" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" stroke-linejoin="round" stroke-linecap="round"></path>
      </svg>
    </div>
    <div className=" transition-all ">
      <h1 className="font-semibold text-gray-700 capitalize"> {user.name}</h1>
      <p className="text-gray-500 text-sm">{user.email}</p>
    </div>
 
  </div>
</div>
    );
};

export default UserInfo;
