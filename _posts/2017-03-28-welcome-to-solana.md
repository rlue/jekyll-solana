---
title: Welcome to Solana
teaser: These sample posts are provided as a template for creating your own content.
category: intro
tags: [markdown, workflow, foss]
reddit_post: 'https://www.reddit.com/r/programming/comments/43qrr1/github_pages_now_faster_and_simpler_with_jekyll_30/'
---

GitHub Pages uses a Markdown engine called <dfn>kramdown</dfn> for formatting text posts:

> **Starting May 1st, 2016, GitHub Pages will only support [kramdown][kd],
> Jekyll’s default Markdown engine.** If you are currently using [Rdiscount][rd]
> or [Redcarpet][rc] we’ve enabled kramdown’s GitHub-flavored Markdown support
> by default, meaning kramdown should have all the features of the two
> deprecated Markdown engines, so the transition should be as simple as updating
> the Markdown setting to `kramdown` in your site’s configuration (or removing
> it entirely) over the course of the next three months.

kramdown is a superset of Markdown, meaning 1) anything that’s valid Markdown is also valid kramdown, and 2) it provides and strictly specifies a number of features that are not available in Markdown.[^1] 

Consult the official [kramdown syntax reference][kds] for an exhaustive list of features and how to use them.

---

[^1]:
    Such as footnotes.

[kd]: http://kramdown.gettalong.org/
[rd]: https://github.com/davidfstr/rdiscount
[rc]: https://github.com/vmg/redcarpet
[kds]: https://kramdown.gettalong.org/syntax.html
