/** Preset avatar icon: emoji or image on a contrasting background. */
export default function PresetAvatarFace({
  emoji,
  image,
  color,
  emojiClass = 'text-2xl',
  className = 'h-full w-full',
  alt = '',
}) {
  return (
    <span
      className={`flex items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden={!alt}
    >
      {image ? (
        <img src={image} alt={alt} className="h-[88%] w-[88%] object-contain" draggable={false} />
      ) : (
        <span className={emojiClass}>{emoji}</span>
      )}
    </span>
  )
}
