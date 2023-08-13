import { useEffect } from 'react';
import { useRouter } from 'next/router';

const TwitterCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const oauthToken = router.query.oauth_token;
    const oauthVerifier = router.query.oauth_verifier;

    if (oauthToken && oauthVerifier) {
      // TODO: You can use these values to make further API calls to Twitter if needed

      // Navigate to a "success" page or display a message
      router.push('/success'); // Redirect to a success page
      // Alternatively, you can set some state to display a success message on the current page
    } else {
      // Handle errors
      // Redirect to an error page or display an error message
      router.push('/error');
    }
  }, [router.query]);

  return (
    <div>
      Please wait...
    </div>
  );
}

export default TwitterCallback;
