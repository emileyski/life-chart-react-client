// import { useSelector } from 'react-redux';
// import { RootState } from '../store';

import { useSignOutMutation } from '../state/api/authApi';

// const Header = () => {
//   const isAuthorized = useSelector(
//     (state: RootState) => state.auth.isAuthorized
//   );

//   return (
//     <header>
//       <h1>My App</h1>
//       {isAuthorized ? (
//         <p>Welcome, Dear User!</p>
//       ) : (
//         <p>
//           <a href="/login">Login</a>
//         </p>
//       )}
//     </header>
//   );
// };

// export default Header;

const Header = () => {
  const [signOut] = useSignOutMutation();

  return (
    <header className="p-2 bg-[#2C3659]">
      <div className="flex w-full justify-between">
        <a href="/dashboard">
          <img
            src="/logo.svg"
            className="h-full object-contain object-center"
            alt="LifeChart"
          />
        </a>

        {/* <form action="/?/signOut" method="post">
          <button type="submit" className="text-white bg-red-500 rounded-lg px-4 py-2">
            Sign Out
            </button>
        </form> */}
        <button
          onClick={() => signOut()}
          className="text-white bg-[#252C48] rounded-lg px-4 py-2 font-semibold"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
