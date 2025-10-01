// Explicitly ensure the login page uses its own layout and does not inherit the StaffLayout.

// Ensure the login page is not wrapped by the StaffLayout by explicitly overriding the layout.

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}