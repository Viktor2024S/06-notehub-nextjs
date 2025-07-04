import Link from "next/link";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/" className={css.link}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/notes" className={css.link}>
              Notes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
