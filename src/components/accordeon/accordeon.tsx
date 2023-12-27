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

  const moveTrack = $((perc: number) => {
    $track.value!.style.transform = `translate(${33 + perc}%,0%)`;
  });

  // const computeCenterElement = $((andCenter = false) => {
  //   const trackRect = $accordeon.value!.getBoundingClientRect();
  //   const center = trackRect.left + trackRect.width / 2;
  //   const trackChildren = Array.from($track.value!.children);

  //   trackChildren.forEach((element) => {
  //     const elem = element as HTMLElement;
  //     const rect = elem.getBoundingClientRect();
  //     const elemX = rect.left;
  //     const elemWidth = rect.width;

  //     elem.style.transform = "";
  //     if (elemX < center && center < elemX + elemWidth) {
  //       elem.style.transform = `scale3d(1.12,1.12,1.12)`;

  //       if (andCenter) {
  //         // move the element to the center
  //         // compute center to center distance
  //         const elemCenter = elemX + elemWidth / 2;
  //         const deltaCenter = center - elemCenter;
  //         let nxt = percentage.value;
  //         const dltCtrPerc = (deltaCenter / trackRect.width) * 100;
  //         console.log(dltCtrPerc);
  //         nxt += dltCtrPerc;
  //         $track.value!.style.transition = `transition: transform 1000ms ease-in-out`;
  //         setTimeout(() => {
  //           moveTrack(nxt);
  //         }, 20);
  //       }
  //     }
  //   });
  // });

  const computeClosestElement = $((andCenter = false) => {
    const trackRect = $accordeon.value!.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    const trackChildren = Array.from($track.value!.children);
    let closest: Element | undefined = undefined;
    let lastDelta = -1;
    trackChildren.forEach((element) => {
      const elem = element as HTMLElement;
      const rect = elem.getBoundingClientRect();
      const elemX = rect.left;
      const elemWidth = rect.width;
      const elemCenter = elemX + elemWidth / 2;

      elem.style.transform = "";
      if (Math.abs(center - elemCenter) < lastDelta || lastDelta == -1) {
        lastDelta = Math.abs(center - elemCenter);
        closest = element;
      }
    });

    if (!closest) return;
    const elem = closest as HTMLElement;
    elem.style.transform = `scale3d(1.12,1.12,1.12)`;
    const rect = elem.getBoundingClientRect();
    const elemX = rect.left;
    const elemWidth = rect.width;
    if (andCenter) {
      // move the element to the center
      // compute center to center distance
      const elemCenter = elemX + elemWidth / 2;
      const deltaCenter = center - elemCenter;
      let nxt = percentage.value;
      const dltCtrPerc = (deltaCenter / trackRect.width) * 100;
      console.log(dltCtrPerc);
      nxt += dltCtrPerc;
      percentage.value = nxt
      moveTrack(nxt)
    }
  });

  useVisibleTask$(() => {
    computeClosestElement(true);
  });

  return (
    <div
      onwheel$={(e: WheelEvent) => {
        let nxt = percentage.value;
        if (e.deltaY > 0) {
          nxt -= 0.75;
        } else if (e.deltaY < 0) {
          nxt += 0.75;
        }
        if (nxt >= 33 || nxt <= -100) {
          return;
        } else {
          e.preventDefault();
        }
        percentage.value = nxt;

        moveTrack(nxt);
        computeClosestElement(false);
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
