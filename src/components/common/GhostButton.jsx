// components/GhostButton.jsx
export default function GhostButton({
  children,
  onClick,
  className = '',
  as = 'button', // 👈 new: 'button' (default) or 'div'
}) {
  const Tag = as;

  return (
    <Tag
      onClick={onClick}
      className={`
        inline-block px-10 py-3
        tracking-wide uppercase font-medium
        border-neutral-100 text-neutral-100
        hover:border-black hover:text-black
        transition-colors
        ${className}
      `}
    >
      {children}
    </Tag>
  );
}
