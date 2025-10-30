# Nube Flow System - Utility Classes Reference

Complete reference of all utility classes in the Nube Flow System.

---

## 📐 Spacing System

All spacing utilities use CSS variables: `var(--gap--0)` through `var(--gap--13)`

### Gap (Flexbox/Grid)

| Class          | Property     | Values                     |
| -------------- | ------------ | -------------------------- |
| `fg0` - `fg13` | `gap`        | Full gap (both directions) |
| `hg0` - `hg13` | `column-gap` | Horizontal gap only        |
| `vg0` - `vg13` | `row-gap`    | Vertical gap only          |

**Example:** `fg3` = `gap: var(--gap--3)`

---

### Margin

| Class          | Property        | Values                    | Special   |
| -------------- | --------------- | ------------------------- | --------- |
| `mt0` - `mt13` | `margin-top`    | 0-13                      | `mt-auto` |
| `mb0` - `mb13` | `margin-bottom` | 0-13                      | `mb-auto` |
| `mr0` - `mr13` | `margin-right`  | 0-13                      | `mr-auto` |
| `ml0` - `ml13` | `margin-left`   | 0-13                      | `ml-auto` |
| `mv0` - `mv13` | `margin-block`  | Vertical (top + bottom)   | `mv-auto` |
| `mh0` - `mh13` | `margin-inline` | Horizontal (left + right) | `mh-auto` |

**Example:** `mt3` = `margin-top: var(--gap--3)`

---

### Padding

| Class          | Property         | Values                    |
| -------------- | ---------------- | ------------------------- |
| `p0` - `p13`   | `padding`        | All sides                 |
| `pt0` - `pt13` | `padding-top`    | Top only                  |
| `pb0` - `pb13` | `padding-bottom` | Bottom only               |
| `pr0` - `pr13` | `padding-right`  | Right only                |
| `pl0` - `pl13` | `padding-left`   | Left only                 |
| `pv0` - `pv13` | `padding-block`  | Vertical (top + bottom)   |
| `ph0` - `ph13` | `padding-inline` | Horizontal (left + right) |

**Example:** `p5` = `padding: var(--gap--5)`

---

## ✍️ Typography

### Font Weight

| Class | Property      | Value                              |
| ----- | ------------- | ---------------------------------- |
| `fw0` | `font-weight` | `var(--font--weight--0)` (Thin)    |
| `fw1` | `font-weight` | `var(--font--weight--1)` (Light)   |
| `fw2` | `font-weight` | `var(--font--weight--2)` (Regular) |
| `fw3` | `font-weight` | `var(--font--weight--3)` (Medium)  |
| `fw4` | `font-weight` | `var(--font--weight--4)` (Bold)    |

---

### Text Decoration

| Class | Property          | Value       |
| ----- | ----------------- | ----------- |
| `td0` | `text-decoration` | `none`      |
| `td1` | `text-decoration` | `underline` |

---

### Text Transform

| Class | Property         | Value        |
| ----- | ---------------- | ------------ |
| `tt0` | `text-transform` | `none`       |
| `tt1` | `text-transform` | `uppercase`  |
| `tt2` | `text-transform` | `lowercase`  |
| `tt3` | `text-transform` | `capitalize` |

---

### Text Wrap

| Class | Property    | Value     |
| ----- | ----------- | --------- |
| `tw0` | `text-wrap` | `wrap`    |
| `tw1` | `text-wrap` | `balance` |
| `tw2` | `text-wrap` | `pretty`  |

---

### Text Align (Responsive)

| Class    | Property             | Breakpoint |
| -------- | -------------------- | ---------- |
| `ta0`    | `text-align: left`   | All sizes  |
| `ta1`    | `text-align: center` | All sizes  |
| `ta2`    | `text-align: right`  | All sizes  |
| `ta0-xs` | `text-align: left`   | All sizes  |
| `ta1-xs` | `text-align: center` | All sizes  |
| `ta2-xs` | `text-align: right`  | All sizes  |
| `ta0-sm` | `text-align: left`   | ≥480px     |
| `ta1-sm` | `text-align: center` | ≥480px     |
| `ta2-sm` | `text-align: right`  | ≥480px     |
| `ta0-md` | `text-align: left`   | ≥768px     |
| `ta1-md` | `text-align: center` | ≥768px     |
| `ta2-md` | `text-align: right`  | ≥768px     |
| `ta0-lg` | `text-align: left`   | ≥992px     |
| `ta1-lg` | `text-align: center` | ≥992px     |
| `ta2-lg` | `text-align: right`  | ≥992px     |

---

## 🎨 Borders & Radius

### Border Radius

| Class         | Property        | Value                                         |
| ------------- | --------------- | --------------------------------------------- |
| `br0` - `br4` | `border-radius` | `var(--radius--0)` through `var(--radius--4)` |

---

### Border Width

| Class         | Property       | Value                                         |
| ------------- | -------------- | --------------------------------------------- |
| `bw0` - `bw4` | `border-width` | `var(--border--0)` through `var(--border--4)` |

---

## 📦 Layout & Flexbox

### Flex Container

| Class    | Display | Direction                 | Wrap   |
| -------- | ------- | ------------------------- | ------ |
| `.fx`    | `flex`  | `column`                  | -      |
| `.fx-xs` | `flex`  | `row`                     | `wrap` |
| `.fx-sm` | `flex`  | `column` → `row` @ ≥480px | `wrap` |
| `.fx-md` | `flex`  | `column` → `row` @ ≥768px | `wrap` |
| `.fx-lg` | `flex`  | `column` → `row` @ ≥992px | `wrap` |

---

### Flex Direction (Responsive)

| Class               | Value            | Breakpoint |
| ------------------- | ---------------- | ---------- |
| `fd0-xs`            | `column`         | All sizes  |
| `fd1-xs`            | `row`            | All sizes  |
| `fd2-xs`            | `column-reverse` | All sizes  |
| `fd3-xs`            | `row-reverse`    | All sizes  |
| `fd0-sm` - `fd3-sm` | Same values      | ≥480px     |
| `fd0-md` - `fd3-md` | Same values      | ≥768px     |
| `fd0-lg` - `fd3-lg` | Same values      | ≥992px     |

---

### Justify Content (Responsive)

| Class               | Value           | Breakpoint |
| ------------------- | --------------- | ---------- |
| `fj0-xs`            | `start`         | All sizes  |
| `fj1-xs`            | `center`        | All sizes  |
| `fj2-xs`            | `end`           | All sizes  |
| `fj3-xs`            | `space-between` | All sizes  |
| `fj4-xs`            | `space-around`  | All sizes  |
| `fj5-xs`            | `space-evenly`  | All sizes  |
| `fj0-sm` - `fj5-sm` | Same values     | ≥480px     |
| `fj0-md` - `fj5-md` | Same values     | ≥768px     |
| `fj0-lg` - `fj5-lg` | Same values     | ≥992px     |

---

### Align Items (Responsive)

| Class               | Value       | Breakpoint |
| ------------------- | ----------- | ---------- |
| `fa0-xs`            | `start`     | All sizes  |
| `fa1-xs`            | `center`    | All sizes  |
| `fa2-xs`            | `end`       | All sizes  |
| `fa3-xs`            | `stretch`   | All sizes  |
| `fa4-xs`            | `baseline`  | All sizes  |
| `fa0-sm` - `fa4-sm` | Same values | ≥480px     |
| `fa0-md` - `fa4-md` | Same values | ≥768px     |
| `fa0-lg` - `fa4-lg` | Same values | ≥992px     |

---

### Flex Wrap (Responsive)

| Class                 | Value          | Breakpoint |
| --------------------- | -------------- | ---------- |
| `fwr0-xs`             | `nowrap`       | All sizes  |
| `fwr1-xs`             | `wrap`         | All sizes  |
| `fwr2-xs`             | `wrap-reverse` | All sizes  |
| `fwr0-sm` - `fwr2-sm` | Same values    | ≥480px     |
| `fwr0-md` - `fwr2-md` | Same values    | ≥768px     |
| `fwr0-lg` - `fwr2-lg` | Same values    | ≥992px     |

---

### Align Self

| Class | Value        |
| ----- | ------------ |
| `as0` | `auto`       |
| `as1` | `flex-start` |
| `as2` | `center`     |
| `as3` | `flex-end`   |
| `as4` | `stretch`    |
| `as5` | `baseline`   |

---

### Justify Self

| Class | Value        |
| ----- | ------------ |
| `js0` | `auto`       |
| `js1` | `flex-start` |
| `js2` | `center`     |
| `js3` | `flex-end`   |
| `js4` | `stretch`    |
| `js5` | `baseline`   |

---

### Flex Grow/Shrink

| Class      | Property         |
| ---------- | ---------------- |
| `grow-0`   | `flex-grow: 0`   |
| `grow-1`   | `flex-grow: 1`   |
| `shrink-0` | `flex-shrink: 0` |
| `shrink-1` | `flex-shrink: 1` |

---

### Flex Order (Responsive)

| Class             | Value          | Breakpoint |
| ----------------- | -------------- | ---------- |
| `of-xs`           | `-999` (first) | All sizes  |
| `o1-xs` - `o6-xs` | `1-6`          | All sizes  |
| `ol-xs`           | `999` (last)   | All sizes  |
| `of-sm` - `ol-sm` | Same values    | ≥480px     |
| `of-md` - `ol-md` | Same values    | ≥768px     |
| `of-lg` - `ol-lg` | Same values    | ≥992px     |

---

## 🔲 Grid System

### Responsive Grid (`lyt`)

**Base class:** `lyt` creates a responsive grid

```html
<div class="lyt 3clm">
  <div class="clm6">Spans 6 columns</div>
</div>
```

### Grid Modes

| Class      | Behavior                                                |
| ---------- | ------------------------------------------------------- |
| `lyt-fill` | `auto-fill` (creates as many columns as fit)            |
| `lyt-fit`  | `auto-fit` (similar to fill but collapses empty tracks) |
| `lyt-fix`  | Fixed column count (no responsiveness)                  |

---

### Column Count

| Class            | Columns                         |
| ---------------- | ------------------------------- |
| `1clm` - `12clm` | Sets target column count (1-12) |

**Example:** `lyt 4clm` = Grid with 4 columns

---

### Column Span

| Class            | Span                             |
| ---------------- | -------------------------------- |
| `clm1` - `clm12` | Span 1-12 columns                |
| `clm-full`       | Span all columns (1 to -1)       |
| `clm-indent`     | Span from 2nd to 2nd-last column |

---

### Column Start

| Class                | Start Position       |
| -------------------- | -------------------- |
| `clm-s-auto`         | `auto`               |
| `clm-s1` - `clm-s12` | Start at column 1-12 |

---

### Row Span

| Class         | Span          |
| ------------- | ------------- |
| `rw1` - `rw4` | Span 1-4 rows |

---

### Row Start

| Class               | Start Position   |
| ------------------- | ---------------- |
| `lyt-s-auto`        | `auto`           |
| `lyt-s1` - `lyt-s4` | Start at row 1-4 |

---

## 📏 Width & Max-Width

### Basic Width

| Class    | Value                       |
| -------- | --------------------------- |
| `.cover` | `width: 100%; height: 100%` |
| `.w100`  | `width: 100%`               |

---

### Max Width (Column-based)

| Class          | Max Width                                     |
| -------------- | --------------------------------------------- |
| `mw1` - `mw11` | Based on 12-column layout system with gutters |

**Example:** `mw6` = 6/12 of layout width with gutter calculations

---

### Character Width (`ch`)

Limits text width by character count (readable line lengths)

| Class          | Max Width      | Attribute Alternative      |
| -------------- | -------------- | -------------------------- |
| `ch1` - `ch80` | `1ch` - `80ch` | `maxch="1"` - `maxch="80"` |

**Example:** `ch60` = `max-width: 60ch` (ideal for body text)

**Attribute usage:**

```html
<p maxch="65">This paragraph will be max 65 characters wide.</p>
```

---

## 👁️ Visibility

### Hide

| Class   | Effect          |
| ------- | --------------- |
| `.hide` | `display: none` |

---

### Hide at Breakpoints

| Class     | Hidden When                      |
| --------- | -------------------------------- |
| `hide-xs` | Hidden on mobile (<480px)        |
| `hide-sm` | Hidden on small tablets (<768px) |
| `hide-md` | Hidden on tablets (<992px)       |

---

### Show Only at Breakpoints

| Class     | Visible When                                |
| --------- | ------------------------------------------- |
| `show-xs` | Hidden when ≥480px (mobile only)            |
| `show-sm` | Hidden when ≥768px (small tablet and below) |
| `show-md` | Hidden when ≥992px (tablet and below)       |

---

### Show Only in Range

| Class          | Visible When                          |
| -------------- | ------------------------------------- |
| `show-xs-only` | Only on mobile (<480px)               |
| `show-sm-only` | Only on small tablets (480px - 767px) |
| `show-md-only` | Only on tablets (768px - 991px)       |
| `show-lg-only` | Only on desktop (≥992px)              |

---

## 🎯 Breakpoints Reference

| Name                  | Min Width | Max Width |
| --------------------- | --------- | --------- |
| **xs** (mobile)       | -         | 479px     |
| **sm** (small tablet) | 480px     | 767px     |
| **md** (tablet)       | 768px     | 991px     |
| **lg** (desktop)      | 992px     | -         |

---

## 💡 Usage Examples

### Responsive Flex Layout

```html
<div class="fx-md fj1-xs fj3-md fg3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

- Column on mobile, row on tablet+
- Centered on mobile, space-between on tablet+
- Gap level 3

---

### Grid with Responsive Columns

```html
<div class="lyt 4clm vg3 hg2">
  <div class="clm6">Half width</div>
  <div class="clm3">Quarter width</div>
  <div class="clm-full">Full width</div>
</div>
```

---

### Typography Control

```html
<p class="fw3 lh2 tw1 ch65 ta0 ta1-md">
  Medium weight, relaxed line height, balanced text wrap, max 65 characters,
  left-aligned mobile, centered desktop
</p>
```

---

### Spacing Pattern

```html
<section class="pv8 ph5 mb6">
  <div class="mw8 mv-auto">
    <!-- Vertical padding 8, horizontal 5, margin-bottom 6 -->
    <!-- Max width 8/12 columns, centered -->
  </div>
</section>
```

---

## 🔗 Related Documentation

- CSS Variables: Check your project's root CSS for spacing/color tokens
- Components: Modal, Accordion scripts in `/scripts/`
- Cookie Consent: See `COOKIE-CONSENT-DOCS.md`
