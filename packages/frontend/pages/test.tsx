import { useEffect, useState } from "react";

const TestPage = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  if (!show) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Test Page</h1>
      <p>
        This is a test page to verify that the frontend is working correctly. If
        you see this message, the frontend is set up properly. You can also
        check the console for any logs or errors.
      </p>
    </div>
  );
};

export default TestPage;
