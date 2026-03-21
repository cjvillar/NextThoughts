"use client";

import { Suspense, useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@components/Profile";

const UserProfileContent = ({ id }) => {  
  const searchParams = useSearchParams();
  const userName = searchParams.get("name")?.slice(0, 5);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${id}/posts`);
      const data = await response.json();
      setUserPosts(data);
    };

    if (id) fetchPosts();
  }, [id]);

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s page. Explore ${userName}'s Thoughts.`}
      data={userPosts}
    />
  );
};

const UserProfile = ({ params }) => {
  const { id } = use(params);  

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfileContent id={id} />  
    </Suspense>
  );
};

export default UserProfile;