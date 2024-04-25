import { Link } from "react-router-dom";

import { NavItem } from "@/models/types";

const items: NavItem[] = [
  { name: "Home", route: "/" },
  { name: "Products", route: "/products" },
  { name: "Movements", route: "/movements" },
];

const TopNav = () => {
  return (
    <div id="top-nav" className="flex items-center p-6 h-20">
      <nav className="flex-1 flex justify-center bg-white gap-x-7">
        {
          items.map((item: NavItem, index: number) => (
            <Link to={item.route} className="block text-center text-uxr-gray-400 p-2.5" key={index}>
              {item.name}
            </Link>
          ))
        }
      </nav>
    </div>
  );
};

export default TopNav;