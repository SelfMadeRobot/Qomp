import {
  CSSProperties,
  Slot,
  component$,
  useSignal,
  useStylesScoped$,
  $,
  useVisibleTask$,
} from "@builder.io/qwik";
import styles from "./accordeon.css?inline";
export type AccordeonProps = {
  style?: CSSProperties;
};

export const Accordeon = component$<AccordeonProps>(({ style }) => {
  useStylesScoped$(styles);
  const percentage = useSignal(0);
  const $track = useSignal<HTMLDivElement>();
  const $accordeon = useSignal<HTMLDivElement>();

  const computeCenterElement = $(() => {
    const trackRect = $accordeon.value!.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    const trackChildren = Array.from($track.value!.children);

    trackChildren.forEach((element) => {
      const elem = element as HTMLElement;
      const rect = elem.getBoundingClientRect();
      const elemX = rect.left;
      const elemWidth = rect.width;

      elem.style.transform = "";
      if (elemX < center && center < elemX + elemWidth) {
        elem.style.transform = `scale3d(1.12,1.12,1.12)`;
      }
    });
  });

  const moveTrack = $((perc: number) => {
    $track.value!.style.transform = `translate(${33 + perc}%,0%)`;
    computeCenterElement();
  });



  useVisibleTask$(() => {
    computeCenterElement();
  });

  return (
    <div
       onwheel$={(e: WheelEvent) => {
        
        
        let nxt = percentage.value;
        if (e.deltaY > 0) {
          nxt -= .75;
        } else {
          nxt += 0.75;
        } 
        if(nxt >= 33 || nxt <= -100){
          
          return
        }else {
          e.preventDefault()
        }
        percentage.value = nxt;
        
        moveTrack(nxt);
      }}
      class={["accordeon"]}
      ref={$accordeon}
      style={{ ...style }}
    >
      <div ref={$track} class={["track"]}>
        <Slot />
      </div>
    </div>
  );
});
