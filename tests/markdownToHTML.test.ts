import { describe, expect, test } from "vitest";
import { markdownToHTML } from "../src/lib/utils.js";

describe("markdownToHTML", () => {
  test("conversion basique", () => {
    expect(markdownToHTML("**bb**")).toBe("<p><strong>bb</strong></p>");
  });

  test("ajout des rel='nofollow'", () => {
    const text = `[https://perdu.com/](Perdu) - [https://www.google.fr/](Google)`;

    expect(markdownToHTML(text)).toBe(
      '<p><a rel="nofollow" href="Perdu">https://perdu.com/</a> - <a rel="nofollow" href="Google">https://www.google.fr/</a></p>'
    );
  });
});
