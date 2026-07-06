import { describe, expect, it } from "vitest";
import { excerptFromBody } from "$lib/content";

describe("excerptFromBody", () => {
  it("omits MDX imports from excerpts", () => {
    const excerpt = excerptFromBody(`---
title: How to Be Perfect
---
import Aside from "../../../components/Aside.astro";

Written by the venerable Michael Schur, creator of Parks & Recreation and of course, The Good Place.
`);

    expect(excerpt).toBe(
      "Written by the venerable Michael Schur, creator of Parks & Recreation and of course, The Good Place.",
    );
  });

  it("keeps MDX component children while removing component markup", () => {
    const excerpt = excerptFromBody(`<Aside type="tip" title="Ethical Dilemma?">
What are we doing?
</Aside>`);

    expect(excerpt).toBe("What are we doing?");
  });
});
