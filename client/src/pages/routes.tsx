import { Navigate } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout/MainLayout";

import MissingPage from "./404";
import HomePage from "./Home";
import ProductsPage from "./Products";
import MovementsPage from "./Movements";

const routes = [
  { path: "404", element: <MissingPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "movements", element: <MovementsPage /> },
    ]
  },
];

export default routes;