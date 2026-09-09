interface MediaFrameProps {
  aspect?: string;
  dark?: boolean;
  className?: string;
  label?: string;
  children?: React.ReactNode;
}

export default function MediaFrame({
  aspect = "16/9",
  dark = false,
  className = "",
  label = "Project Image",
  children,
}: MediaFrameProps) {
  return (
    <div
      className={`media-frame ${dark ? "media-frame--dark" : ""} ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {children || (
        <div className="media-frame__content">
          <span className="media-frame__label">[{label}]</span>
        </div>
      )}
    </div>
  );
}
