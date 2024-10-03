import { Outlet } from "react-router-dom";

const LayoutAuth = () => {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutAuth;