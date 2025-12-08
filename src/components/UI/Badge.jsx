// src/components/UI/Badge.jsx
export default function Badge({ text, variant = "primary" }) {
  const classes = {
    primary: "bg-primary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-dark",
    danger: "bg-danger text-white",
  };

  return (
    <span className={`badge ${classes[variant]} px-2 py-1`}>
      {text}
    </span>
  );
}
