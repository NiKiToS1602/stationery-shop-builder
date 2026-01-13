import { NavLink, Outlet, useNavigate } from "react-router-dom";

export function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#E9E7FF_0%,#FDE7F4_100%)]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white font-bold">
              S
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-black/90">ShopBuilder</div>
              <div className="text-xs text-black/50">Admin</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <TopLink to="/admin/builder" label="Шаблоны" />
            <TopLink to="/admin/panel" label="Админ-панель" />

            <div className="mx-2 h-6 w-px bg-black/10" />

            <button
              onClick={logout}
              className="rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 active:scale-[0.99]"
            >
              Выйти
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function TopLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-xl px-4 py-2 text-sm font-medium transition",
          isActive
            ? "bg-white text-black shadow-sm border border-black/5"
            : "text-black/70 hover:bg-white/60 hover:text-black",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}
