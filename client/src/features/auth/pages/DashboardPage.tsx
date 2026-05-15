import AuthNavbar from "../components/AuthNavbar";
import AuthFooter from "../components/AuthFooter";
import { useAuthContext } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuthContext();

  return (
    <>
      <AuthNavbar />
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          marginTop: 68,
          display: "grid",
          placeItems: "center",
          padding: "32px 20px",
          background:
            "linear-gradient(180deg, #f8fafc 0%, #eff6ff 45%, #ffffff 100%)",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: 720,
            background: "#ffffff",
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
            border: "1px solid #dbeafe",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              color: "#2563eb",
              fontWeight: 700,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Account Ready
          </p>
          <h1 style={{ margin: "0 0 12px", color: "#0f172a", fontSize: 32 }}>
            Welcome back{user ? `, ${user.fullName}` : ""}.
          </h1>
          <p style={{ margin: "0 0 24px", color: "#64748b", lineHeight: 1.7 }}>
            Your authentication flow is now connected. You are signed in as{" "}
            <strong>{user?.email ?? "an authenticated user"}</strong>.
          </p>
          <div
            style={{
              display: "grid",
              gap: 12,
              marginBottom: 24,
              color: "#1e293b",
            }}
          >
            <div>
              <strong>Role:</strong> {user?.role ?? "Unknown"}
            </div>
            <div>
              <strong>Email verified:</strong>{" "}
              {user?.isVerified ? "Yes" : "No"}
            </div>
            <div>
              <strong>User ID:</strong> {user?.userId ?? "Unavailable"}
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            style={{
              border: "none",
              borderRadius: 14,
              padding: "14px 18px",
              fontWeight: 700,
              color: "#ffffff",
              cursor: "pointer",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            }}
          >
            Logout
          </button>
        </section>
      </main>
      <AuthFooter />
    </>
  );
}
