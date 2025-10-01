// Explicitly ensure the register page uses its own layout and does not inherit the StaffLayout.
export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}