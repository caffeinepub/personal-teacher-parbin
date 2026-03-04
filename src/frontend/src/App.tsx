import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import AdminPage from "./pages/AdminPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import ProgressPage from "./pages/ProgressPage";
import SubjectPage from "./pages/SubjectPage";
import SubjectsPage from "./pages/SubjectsPage";

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const classRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/class/$classNum",
  component: SubjectsPage,
});

const subjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/class/$classNum/subject/$subject",
  component: SubjectPage,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/progress",
  component: ProgressPage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  classRoute,
  subjectRoute,
  progressRoute,
  chatRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
