import { useRoutes } from "react-router-dom";

import routes from "@/pages/routes";

const App = () => {
  const routing = useRoutes(routes);

  return (
    <>
      {routing}
    </>
  );
};

export default App;