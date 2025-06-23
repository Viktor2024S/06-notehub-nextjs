import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Viktor2024S</p>
          <p>
            Contact us:{" "}
            <a href="mailto:admin@notehub.app" className={css.contactLink}>
              admin@notehub.app
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
