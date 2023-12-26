import {
  CSSProperties,
  QRL,
  Slot,
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./card.css?inline";
type CardProps = {
  style?: CSSProperties;
  hoverEffect?: "3d" | "glow";
  gridSpan?: number;
  onClick$?: QRL<(ev: MouseEvent) => void>;
};
export const Card = component$<CardProps>(
  ({ style, hoverEffect, onClick$, gridSpan }) => {
    useStyles$(styles);
    const $card = useSignal<HTMLDivElement>();
    const mouseIn = useSignal(false);

    useVisibleTask$(({ cleanup }) => {
      if ($card.value && hoverEffect && hoverEffect == "3d") {
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

          $card.value!.style.transform = `
              scale3d(1.03, 1.03, 1.03)
              rotate3d(
                ${center.y / 100},
                ${-center.x / 100},
                0,
                ${Math.log(distance) * 2}deg
              )
            `;

          (
            $card.value!.querySelector(".glow")! as HTMLElement
          ).style.backgroundImage = `
              radial-gradient(
                circle at
                ${center.x * 2 + bounds.width / 2}px
                ${center.y * 2 + bounds.height / 2}px,
                #ffffff55,
                #0000000f
              )
            `;
        };
        const mouseEnter = () => {
          mouseIn.value = true;
          bounds = $card.value!.getBoundingClientRect();
          document.addEventListener("mousemove", rotateToMouse);
        };

        const mouseLeave = () => {
          mouseIn.value = false;
          document.removeEventListener("mousemove", rotateToMouse);
          $card.value!.style.transform = "";
        };

        $card.value!.addEventListener("mouseenter", mouseEnter);
        $card.value!.addEventListener("mouseleave", mouseLeave);

        if (gridSpan) {
          const computeAll = () => {
            console.log($card.value!.clientHeight);
            if (
              $card.value!.scrollHeight! > gridSpan &&
              $card.value!.scrollHeight! <= gridSpan * 2
            ) {
              $card.value!.style.gridRowEnd = "span 2";
            } else if (
              $card.value!.scrollHeight! > gridSpan * 2 &&
              $card.value!.scrollHeight! <= gridSpan * 3
            ) {
              $card.value!.style.gridRowEnd = "span 3";
            } else if ($card.value!.scrollHeight! > gridSpan * 3) {
              $card.value!.style.gridRowEnd = "span 4";

            } else {
              $card.value!.style.gridRowEnd = "span 1";
            }
          };
          computeAll();
        }

        cleanup(() => {
          $card.value!.removeEventListener("mouseenter", mouseEnter);
          $card.value!.removeEventListener("mouseleave", mouseLeave);
        });
      }
    });
    return (
      <div
        ref={$card}
        class={["card"]}
        style={{ ...style, cursor: onClick$ ? "pointer" : "initial" }}
        onClick$={(ev: MouseEvent) => {
          if (onClick$) onClick$(ev);
        }}
      >
        {hoverEffect && hoverEffect == "3d" && mouseIn.value && (
          <div class="card glow" />
        )}
        <div class="content">
          <Slot />
        </div>
      </div>
    );
  }
);
