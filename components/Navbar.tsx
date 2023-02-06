import Link from 'next/link';
import { CgMathPlus } from 'react-icons/cg';
import { IoSearchOutline } from 'react-icons/io5';
import { signIn, useSession } from 'next-auth/react';
import User from './User';
import LogoLight from '../utils/LogoLight';
import LogoDark from '../utils/LogoDark';
import useThemeStore from '../store/theme';

export default function Navbar() {
  const { data: user }: any = useSession();

  const { theme } = useThemeStore();

  return (
    <nav className='border-b border-b-[rgba(34,90,89,0.2)] dark:border-b-darkBorder dark:bg-dark'>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-2 lg:px-4 py-2'>
        <Link href='/'>{theme === 'dark' ? <LogoDark /> : <LogoLight />}</Link>

        <div className='hidden md:flex items-center dark:text-white bg-gray-100 dark:bg-darkSecondary rounded-full overflow-hidden border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-500 focus-within:bg-gray-200 dark:focus-within:bg-darkSecondary'>
          <input
            type='text'
            placeholder='Search accounts and videos'
            className='peer p-2 pl-4 border-none outline-none bg-transparent dark:placeholder-gray-500'
          />

          <div className='w-11 h-10 flex items-center justify-center border-l text-gray-400 border-l-gray-200 dark:border-l-gray-500 peer-focus:border-l-gray-300 dark:peer-focus:border-l-gray-500 cursor-pointer'>
            <IoSearchOutline size={23} />
          </div>
        </div>

        <div className='flex items-center'>
          {user ? (
            <>
              <Link
                href='/upload'
                className='btn-secondary flex items-center mr-2'
              >
                <CgMathPlus />
                <p className='ml-2'>Upload</p>
              </Link>

              <User />
            </>
          ) : (
            <button onClick={() => signIn('google')} className='btn-primary'>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
