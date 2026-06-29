import { Routes, Route } from "react-router-dom";

import MainLayout from "./frontend/layouts/MainLayout";
import Home from "./frontend/pages/Home";
import AboutUs from "./frontend/pages/AboutUs";
import FrontendProducts from "./frontend/pages/Products";
import ProductDetails from "./frontend/pages/ProductDetails";
import ContactUs from "./frontend/pages/ContactUs";



import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/products/Products";
import AddProduct from "./admin/pages/products/AddProduct";
import EditProduct from "./admin/pages/products/EditProduct";
import Categories from "./admin/pages/categories/Categories";
import AddCategory from "./admin/pages/categories/AddCategory";
import EditCategory from "./admin/pages/categories/EditCategory";
import CMS from "./admin/pages/cms/CMS";
import AddCMS from "./admin/pages/cms/AddCMS";
import EditCMS from "./admin/pages/cms/EditCMS";
import Settings from "./admin/pages/settings/Settings";
import Roles from "./admin/pages/roles/Roles";
import AddRole from "./admin/pages/roles/AddRole";
import EditRole from "./admin/pages/roles/EditRole";
import Admins from "./admin/pages/admins/Admins";
import AddAdmin from "./admin/pages/admins/AddAdmin";
import EditAdmin from "./admin/pages/admins/EditAdmin";
import Inquiries from "./admin/pages/inquiries/Inquiries";
import AdminLayout from "./admin/layouts/AdminLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/about-us"
        element={
          <MainLayout>
            <AboutUs />
          </MainLayout>
        }
      />
      <Route
        path="/products"
        element={
          <MainLayout>
            <FrontendProducts />
          </MainLayout>
        }
      />
      <Route
        path="/products/:slug"
        element={
          <MainLayout>
            <ProductDetails />
          </MainLayout>
        }
      />
      <Route
        path="/contact-us"
        element={
          <MainLayout>
            <ContactUs />
          </MainLayout>
        }
      />

      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminLayout>
            <Products />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/products/add"
        element={
          <AdminLayout>
            <AddProduct />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/products/edit/:id"
        element={
          <AdminLayout>
            <EditProduct />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminLayout>
            <Categories />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/categories/add"
        element={
          <AdminLayout>
            <AddCategory />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/categories/edit/:id"
        element={
          <AdminLayout>
            <EditCategory />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/cms"
        element={
          <AdminLayout>
            <CMS />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/cms/add"
        element={
          <AdminLayout>
            <AddCMS />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/cms/edit/:id"
        element={
          <AdminLayout>
            <EditCMS />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminLayout>
            <Settings />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <AdminLayout>
            <Roles />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/roles/add"
        element={
          <AdminLayout>
            <AddRole />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/roles/edit/:id"
        element={
          <AdminLayout>
            <EditRole />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/admins"
        element={
          <AdminLayout>
            <Admins />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/admins/add"
        element={
          <AdminLayout>
            <AddAdmin />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/admins/edit/:id"
        element={
          <AdminLayout>
            <EditAdmin />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/inquiries"
        element={
          <AdminLayout>
            <Inquiries />
          </AdminLayout>
        }
      />


    </Routes>
  );
}

export default App;