import {
  CSSProperties,
  Slot,
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./link.css?inline";
import { Effect } from "../../lib/effect";

export type LinkProps = {
  href: string;
  style?: CSSProperties;
  hoverEffects?: Effect[];
};
export const Link = component$<LinkProps>(({ href, style, hoverEffects }) => {
  useStylesScoped$(styles);

  const $link = useSignal<HTMLDivElement>();
  const mouseIn = useSignal(false);

  useVisibleTask$(({ cleanup }) => {
    if ($link.value && hoverEffects) {
      let bounds: DOMRect;
      // Use the DOM API to add an event listener.
      const rotateToMouse = (e: MouseEvent) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds!.x;
        const topY = mouseY - bounds.y;
        const center = {
          x: leftX - bounds.width / 2,
          y: topY - bounds.height / 2,
        };
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

        if (hoverEffects.some((h) => h == "3d")) {
          $link.value!.style.transform = `
            scale3d(1.04, 1.04, 1.04)
            rotate3d(
              ${center.y / 100},
              ${-center.x / 100},
              0,
              ${Math.log(distance) * 6}deg
            )
          `;
        }
        
      };
      const mouseEnter = () => {
        mouseIn.value = true;
        bounds = $link.value!.getBoundingClientRect();
        document.addEventListener("mousemove", rotateToMouse);
      };

      const mouseLeave = () => {
        mouseIn.value = false;
        document.removeEventListener("mousemove", rotateToMouse);
        $link.value!.style.transform = "";
      };

      $link.value!.addEventListener("mouseenter", mouseEnter);
      $link.value!.addEventListener("mouseleave", mouseLeave);

      cleanup(() => {
        $link.value!.removeEventListener("mouseenter", mouseEnter);
        $link.value!.removeEventListener("mouseleave", mouseLeave);
      });
    }
  });
  return (
    <div class="link">
      <a href={href} ref={$link} style={{ ...style }}>
        <Slot />
      </a>
    </div>
  );
});
