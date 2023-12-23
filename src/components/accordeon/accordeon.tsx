import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./accordeon.css?inline"

export const Accordeon = component$(() => {
    useStylesScoped$(styles)
    return <div></div>
});