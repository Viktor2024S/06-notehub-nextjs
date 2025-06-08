import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = "Whoops, something went wrong! Please try reloading this page!",
}: ErrorMessageProps) {
  return <p className={css.error}>{message}</p>;
}
