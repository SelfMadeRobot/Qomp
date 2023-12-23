import { CSSProperties, Slot, component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./form.css?inline";

type FormProps = {
  style?: CSSProperties;
};

export const Form = component$<FormProps>(({ style }) => {

  useStylesScoped$(styles)
  return (
    <form class={['form']} style={{ ...style }}>
      <Slot />
    </form>
  );
});
