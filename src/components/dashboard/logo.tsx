import Link from "next/link";

export const Logo = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
  <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-accent shrink-0"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
      <path d="M2 17l10 5 10-5"></path>
      <path d="M2 12l10 5 10-5"></path>
    </svg>
    {!isCollapsed && <span className="whitespace-nowrap">TransactEasy</span>}
  </Link>
);
