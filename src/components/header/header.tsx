import { CSSProperties, component$, useStylesScoped$ } from "@builder.io/qwik";
import header from "./header.css?inline";
import { Link } from "../link/link";

export type MenuItem = {
  text: string,
  href: string
}
export type HeaderProps = {
  style?: CSSProperties;
  title: string;
  items: MenuItem[]
};
export const Header = component$<HeaderProps>(({ style, title, items }) => {
  useStylesScoped$(header);

  return (
    <header class={["header"]} style={{ ...style }}>
      <div class={["content-wrapper"]}>
        <div class={["content"]}>
          <h1>{title}</h1>
          <nav>
            <label id="hamburger" for="toggle">
              ☰
            </label>
          </nav>
        </div>
        <input type="checkbox" id="toggle" />
        <div class="drawer">
          {items.map((m,i) => (<Link  key={i} hoverEffects={['3d','glow']} href={m.href}>{m.text}</Link>))}
        </div>
      </div>
    </header>
  );
});
