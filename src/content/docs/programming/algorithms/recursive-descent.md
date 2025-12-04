---
title: Recursive descent parsing
---

A *recursive descent parser* (RDP) is a **top-down** parser where each nonterminal of a context-free grammar is implemented as a (mutually) recursive procedure.
It parses from left to right, expanding productions according to the grammar and the current lookahead token.[^1]

For *predictive* recursive descent (no backtracking), the grammar is typically in the LL(1) family:
the next production can be chosen using a fixed, small lookahead (often one token).[^3]

Key consequences:

- Parser structure mirrors the grammar, which makes RDP ideal for *handwritten* parsers and small DSLs.[^2]
- Time complexity is linear in the input length for LL(1) grammars; it may blow up with naïve backtracking.

## Grammar Requirements and Complexity

Given a nonterminal A with productions:

> A → α₁ | α₂ | … | αₙ

An LL(1) grammar must satisfy (informally):[^4]

- FIRST(αᵢ) ∩ FIRST(αⱼ) = ∅ for all i ≠ j.
- If ε ∈ FIRST(αᵢ), then FIRST(αⱼ) ∩ FOLLOW(A) = ∅ for all j ≠ i.

When these conditions hold:

- A predictive recursive descent parser runs in **O(n)** for input length n.
- Decisions are deterministic: the parser never backtracks.
- FIRST/FOLLOW can also be used to design more precise error messages.[^6]

If these conditions are violated and you rely on backtracking, worst-case behavior can become exponential or even non-terminating on some grammars.

## Left Recursion and Left Factoring

Naïve RDP cannot handle *left recursion*:

> E → E + T | T

because `parse_E` immediately calls itself without consuming any input.

### Eliminating immediate left recursion

For

> A → A α₁ | … | A αₘ | β₁ | … | βₙ

where each βᵢ does *not* start with A, we transform to:

> A  → β₁ A' | … | βₙ A'
> A' → α₁ A' | … | αₘ A' | ε

This converts left recursion into right recursion, making A suitable for RDP.

### Indirect left recursion and left factoring

- *Indirect* left recursion (A ⇒⁺ A via other nonterminals) is eliminated by systematically substituting productions before applying the immediate transformation.[^1]
- *Left factoring* removes common prefixes:

  > A → α β₁ | α β₂  ⇒  A → α A' ; A' → β₁ | β₂

  This ensures the parser can choose the correct production from a single
  lookahead token.

## Predictive recursive descent

- Uses FIRST/FOLLOW and lookahead to choose productions.
- Requires LL(1) (or LL(k)/SLL)-like grammars.
- Runs in linear time and produces localized, understandable errors.

## Backtracking recursive descent

- Tries alternatives in sequence, rewinding input when one fails.
- More flexible (can accept some non-LL grammars) but risks:
    - Exponential running time in the worst case.
    - Non-termination on certain recursive patterns.

Modern practice tends to favor predictive RDP, occasionally augmented with semantic or syntactic predicates when the grammar alone is insufficient.[^8]

## Expression Parsing and Pratt Parsers

"Natural" expression grammars are often left-recursive:

> E → E + T | T
> T → T * F | F
> F → (E) | num

Typical RDP strategies:

1. *Left-recursion elimination* plus explicit precedence levels.
2. *Top-down operator precedence* (a.k.a. **Pratt parsing**), where expression parsing is treated as a specialized recursive descent with per-operator binding powers.[^8]

Pratt’s 1973 paper combines recursive descent with operator precedence in a top-down manner.
It remains influential and is widely used in modern hand-written parsers (e.g. Desmos, various interpreters).[^7]

## OCaml Skeleton For Predictive RDP

A minimal, LL(1)-style expression parser in OCaml, using separate nonterminals for expression, term, and factor:

> Expr     → Term ExprTail
> ExprTail → (+|-) Term ExprTail | ε
> Term     → Factor TermTail
> TermTail → (*|/) Factor TermTail | ε
> Factor   → INT | "(" Expr ")"

Sketch of an OCaml implementation:

```ocaml
type token =
  | INT of int
  | PLUS | MINUS
  | TIMES | DIV
  | LPAREN | RPAREN
  | EOF

type expr =
  | Int  of int
  | Add  of expr * expr
  | Sub  of expr * expr
  | Mul  of expr * expr
  | DivE of expr * expr

exception Parse_error of string

type state = {
  tokens : token array;
  mutable pos : int;
}

let peek st =
  if st.pos < Array.length st.tokens then st.tokens.(st.pos) else EOF

let advance st =
  st.pos <- st.pos + 1

let expect st tok =
  if peek st = tok then advance st
  else raise (Parse_error "unexpected token")

let rec parse_expr st =
  let left = parse_term st in
  parse_expr_tail st left

and parse_expr_tail st left =
  match peek st with
  | PLUS  -> advance st;
             let right = parse_term st in
             parse_expr_tail st (Add (left, right))
  | MINUS -> advance st;
             let right = parse_term st in
             parse_expr_tail st (Sub (left, right))
  | _ -> left  (* epsilon *)

and parse_term st =
  let left = parse_factor st in
  parse_term_tail st left

and parse_term_tail st left =
  match peek st with
  | TIMES -> advance st;
             let right = parse_factor st in
             parse_term_tail st (Mul (left, right))
  | DIV   -> advance st;
             let right = parse_factor st in
             parse_term_tail st (DivE (left, right))
  | _ -> left  (* epsilon *)

and parse_factor st =
  match peek st with
  | INT n ->
      advance st;
      Int n
  | LPAREN ->
      advance st;
      let e = parse_expr st in
      expect st RPAREN;
      e
  | _ ->
      raise (Parse_error "expected factor")

let parse toks =
  let st = { tokens = Array.of_list toks; pos = 0 } in
  let ast = parse_expr st in
  match peek st with
  | EOF -> ast
  | _   -> raise (Parse_error "extra tokens at end")
```

This is the standard "grammar-shaped" style seen in many teaching materials and small language implementations.

## Error Handling and Incremental Parsing

Classical texts outline several error-recovery strategies for recursive descent parsers:

- *Panic mode*: on error, skip tokens until a synchronizing symbol (e.g. `;`, `}`) is found.
- *Phrase-level*: attempt small local repairs (insert/delete single tokens) and continue parsing.
- *Error productions*: add explicit "error rules" to the grammar for common mistakes.

For interactive tools and IDEs, RDP can be adapted to **incremental parsing**:

Only affected regions of the source are re-parsed after an edit, preserving most of the previous parse tree.

## When To Use Recursive Descent

Advantages:

- Parser code is straightforward and closely matches the grammar.[^5]
- Semantic actions and AST construction are easy to interleave with parsing.
- No parser generator or external build step is required.
- Combining RDP with Pratt parsing yields a compact yet expressive expression parser.[^7]

Limitations:

- Grammars must be made LL-friendly (no left recursion, careful factoring), which can be awkward for some language designs.
- Robust error recovery must be hand-engineered.
- For highly ambiguous or complex grammars, GLR/GLL or LR-style tools may be more appropriate.

[^1]: Aho, Alfred V., et al., editors. Compilers: Principles, Techniques, & Tools. 2. ed., Pearson internat. ed, Pearson Addison-Wesley, 2007.
[^2]: <https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html> "Simple but Powerful Pratt Parsing - matklad"
[^3]: <https://blog.jeffsmits.net/ll-parsing-recursive-descent/> "LL Parsing and Recursive Descent"
[^4]: <https://andrewbegel.com/cs164/ll1.html> "LL(1) Parsing"
[^5]: <https://www.cs.rochester.edu/users/faculty/nelson/courses/csc_173/grammars/parsing.html> "Recursive-Descent Parsing"
[^6]: <https://www.cs.uaf.edu/users/chappell/public_html/class/2020_spr/cs331/lect/cs331-20200212-recdes_b.pdf> "Recursive-Descent Parsing - UAF CS"
[^7]: <https://www.crockford.com/javascript/tdop/tdop.html> "Top Down Operator Precedence"
[^8]: <https://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/> "Pratt Parsers: Expression Parsing Made Easy - Bob Nystrom"
