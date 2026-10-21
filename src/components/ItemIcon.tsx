import { Item } from "../utils/items";
import { itemIconUrl } from "../utils/textures";

/** An item's picture: its PNG from public/textures when there is one, else its emoji. */
export default function ItemIcon({ item, className = "" }: { item: Item; className?: string }) {
  const src = itemIconUrl(item.id, item.blockType);
  if (src) {
    return <img src={src} alt="" draggable={false} className={`h-[1.4em] w-[1.4em] object-contain [image-rendering:pixelated] ${className}`} />;
  }
  return (
    <span aria-hidden className={className}>
      {item.emoji}
    </span>
  );
}
