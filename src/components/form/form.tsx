import { CSSProperties, Slot, component$ } from "@builder.io/qwik";
import styles from "./form.module.css";

type FormProps = {
  style?: CSSProperties;
};

export const Form = component$<FormProps>(({ style }) => {
  return (
    <form class={[styles.form]} style={{ ...style }}>
      <Slot />
    </form>
  );
});
