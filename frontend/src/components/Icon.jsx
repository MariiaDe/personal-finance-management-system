export default function Icon({ name, className = "" }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <use href={`#icon-${name}`} />
    </svg>
  );
}
