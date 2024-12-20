import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '../utils/client';

interface User {
  _id: string;
  userName: string;
  image: string;
  bio?: string;
}

export default function SuggestedAccounts() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const query = `*[_type == "user"][0...5] {
          _id,
          userName,
          image,
          bio
        }`;
        
        const result = await client.fetch(query);
        
        if (!result) {
          throw new Error('No users found');
        }
        
        setUsers(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching suggested accounts:', err);
        setError('Failed to load suggested accounts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Unable to load suggestions
      </div>
    );
  }

  return (
    <div className="lg:border-b-2 border-gray-200 pb-4">
      <p className="text-gray-500 font-semibold m-3 mt-4 hidden lg:block">
        Suggested Accounts
      </p>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"/>
        </div>
      ) : (
        <div>
          {users.map((user) => (
            <Link href={`/profile/${user._id}`} key={user._id}>
              <div className="flex gap-3 hover:bg-primary p-2 cursor-pointer font-semibold rounded items-center">
                <div className="w-8 h-8 relative">
                  <Image 
                    src={user.image}
                    alt={user.userName}
                    fill
                    className="rounded-full"
                  />
                </div>
                <div className="hidden lg:block">
                  <p className="text-md">{user.userName}</p>
                  {user.bio && (
                    <p className="text-xs text-gray-500">{user.bio}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
