# Cobos UI Components

Per-component reference for the Cobos UI design system — the full Element Plus surface ported to React, delivered in waves. Each linked page documents imports, usage, props, events, and accessibility for stable components, or the planned API direction for components still on the roadmap.

**Legend:** **Stable** — implemented and documented from source. **Planned** — on the roadmap; the API will mirror the linked Element Plus component, adapted to React.

## Basic

| Component | Status | Description |
| --- | --- | --- |
| [Button](./button.md) | Stable | Commonly used button with types, sizes, plain/text/link variants, loading and icons. |
| [Icon](./icon.md) | Stable | Wrapper that renders an SVG glyph with size, color and spin support. |
| [Layout](./layout.md) | Stable | 24-column responsive flexbox grid with Row and Col. |
| [Container](./container.md) | Stable | Page scaffolding: Container, Header, Aside, Main, Footer. |
| [Link](./link.md) | Stable | Text hyperlink with semantic types, underline and disabled states. |
| [Text](./text.md) | Stable | Typographic text with types, sizes, truncation and line clamping. |
| [Space](./space.md) | Stable | Set consistent spacing between inline or stacked children. |
| [Scrollbar](./scrollbar.md) | Planned (Wave 3) | Custom themed scrollbar container. |
| [Splitter](./splitter.md) | Planned (Wave 3) | Resizable split panes. |
| [Typography](./typography.md) | Planned (Wave 3) | Typography scale documentation (covered by Text). |
| [Border](./border.md) | Planned (Wave 3) | Border token reference. |
| [Color](./color.md) | Planned (Wave 3) | Color token reference. |

## Configuration

| Component | Status | Description |
| --- | --- | --- |
| [ConfigProvider](./config-provider.md) | Stable | Provides global size, disabled and direction context to descendants. |

## Form

| Component | Status | Description |
| --- | --- | --- |
| [Input](./input.md) | Stable | Text input with prefix/suffix, clearable, password, textarea and word limit. |
| [InputNumber](./input-number.md) | Stable | Numeric input with steppers, min/max, step and precision. |
| [Select](./select.md) | Stable | Dropdown selector with multiple, filterable and clearable modes. |
| [Checkbox](./checkbox.md) | Stable | Checkbox with group, indeterminate, min/max and bordered styles. |
| [Radio](./radio.md) | Stable | Radio button with group and bordered styles. |
| [Switch](./switch.md) | Stable | On/off toggle with text, icons and loading. |
| [Form](./form.md) | Stable | Form layout and validation with rules and imperative methods. |
| [Rate](./rate.md) | Planned (Wave 2) | Star rating input. |
| [Slider](./slider.md) | Planned (Wave 2) | Range slider input. |
| [TimePicker](./time-picker.md) | Planned (Wave 2) | Time selection input. |
| [DatePicker](./date-picker.md) | Planned (Wave 2) | Date and date-range selection. |
| [Upload](./upload.md) | Planned (Wave 2) | File upload with drag, preview and list. |
| [Autocomplete](./autocomplete.md) | Planned (Wave 3) | Input with suggestion dropdown. |
| [Cascader](./cascader.md) | Planned (Wave 3) | Cascading multi-level selector. |
| [ColorPicker](./color-picker.md) | Planned (Wave 3) | Color selection control. |
| [DateTimePicker](./datetime-picker.md) | Planned (Wave 3) | Combined date and time selection. |
| [InputTag](./input-tag.md) | Planned (Wave 3) | Tokenized tag input. |
| [InputOTP](./input-otp.md) | Planned (Wave 3) | One-time-passcode input. |
| [Mention](./mention.md) | Planned (Wave 3) | Inline @mention suggestions. |
| [TimeSelect](./time-select.md) | Planned (Wave 3) | Fixed-interval time selector. |
| [Transfer](./transfer.md) | Planned (Wave 3) | Dual-list transfer control. |
| [TreeSelect](./tree-select.md) | Planned (Wave 3) | Tree-structured selector. |
| [VirtualizedSelect](./virtualized-select.md) | Planned (Wave 3) | Virtualized select for large option sets. |

## Data

| Component | Status | Description |
| --- | --- | --- |
| [Avatar](./avatar.md) | Stable | Image, icon or text avatar in circle or square. |
| [Card](./card.md) | Stable | Content container with header, body, footer and shadow modes. |
| [Table](./table.md) | Stable | Data table with sorting, selection, border, stripe and fixed header. |
| [Tag](./tag.md) | Stable | Label tag with types, effects, sizes and closable. |
| [Pagination](./pagination.md) | Stable | Pager with sizes, jumper, total and background variants. |
| [Badge](./badge.md) | Planned (Wave 2) | Count or dot badge on an element. |
| [Progress](./progress.md) | Planned (Wave 2) | Linear and circular progress. |
| [Skeleton](./skeleton.md) | Planned (Wave 2) | Loading placeholder. |
| [Empty](./empty.md) | Planned (Wave 2) | Empty-state placeholder. |
| [Descriptions](./descriptions.md) | Planned (Wave 2) | Key/value description list. |
| [Collapse](./collapse.md) | Planned (Wave 2) | Accordion collapse panels. |
| [Tree](./tree.md) | Planned (Wave 2) | Hierarchical tree view. |
| [Calendar](./calendar.md) | Planned (Wave 3) | Month/date calendar. |
| [Carousel](./carousel.md) | Planned (Wave 3) | Image/content carousel. |
| [Image](./image.md) | Planned (Wave 3) | Image with lazy load and preview. |
| [InfiniteScroll](./infinite-scroll.md) | Planned (Wave 3) | Load more on scroll. |
| [Result](./result.md) | Planned (Wave 3) | Result/feedback page block. |
| [Statistic](./statistic.md) | Planned (Wave 3) | Numeric statistic with countdown. |
| [Segmented](./segmented.md) | Planned (Wave 3) | Segmented control. |
| [Timeline](./timeline.md) | Planned (Wave 3) | Vertical timeline. |
| [Tour](./tour.md) | Planned (Wave 3) | Guided product tour. |
| [VirtualizedTable](./virtualized-table.md) | Planned (Wave 3) | Virtualized table for large datasets. |
| [VirtualizedTree](./virtualized-tree.md) | Planned (Wave 3) | Virtualized tree for large datasets. |

## Navigation

| Component | Status | Description |
| --- | --- | --- |
| [Tabs](./tabs.md) | Stable | Tabbed navigation with line, card and border-card types and 4 positions. |
| [Menu](./menu.md) | Stable | Vertical/horizontal menu with submenus, groups and collapse. |
| [Dropdown](./dropdown.md) | Stable | Dropdown menu triggered by hover or click. |
| [Breadcrumb](./breadcrumb.md) | Planned (Wave 2) | Breadcrumb trail. |
| [Steps](./steps.md) | Planned (Wave 2) | Step/wizard progress. |
| [PageHeader](./page-header.md) | Planned (Wave 2) | Page header with back and breadcrumb. |
| [Affix](./affix.md) | Planned (Wave 3) | Pin an element on scroll. |
| [Anchor](./anchor.md) | Planned (Wave 3) | Scroll-spy anchor links. |
| [Backtop](./backtop.md) | Planned (Wave 3) | Back-to-top button. |

## Feedback

| Component | Status | Description |
| --- | --- | --- |
| [Dialog](./dialog.md) | Stable | Modal dialog with focus trap, scroll lock and dismissal. |
| [Alert](./alert.md) | Planned (Wave 2) | Inline alert banner. |
| [Tooltip](./tooltip.md) | Planned (Wave 2) | Hover/focus tooltip. |
| [Popover](./popover.md) | Planned (Wave 2) | Rich popover panel. |
| [Popconfirm](./popconfirm.md) | Planned (Wave 2) | Inline confirmation popover. |
| [Drawer](./drawer.md) | Planned (Wave 2) | Slide-in panel from an edge. |
| [Message](./message.md) | Planned (Wave 2) | Imperative toast message. |
| [Notification](./notification.md) | Planned (Wave 2) | Imperative corner notification. |
| [MessageBox](./message-box.md) | Planned (Wave 2) | Imperative alert/confirm/prompt dialog. |
| [Loading](./loading.md) | Planned (Wave 2) | Full-area loading mask via hook/component. |

## Others

| Component | Status | Description |
| --- | --- | --- |
| [Divider](./divider.md) | Stable | Horizontal or vertical separator with optional label. |
| [Watermark](./watermark.md) | Planned (Wave 3) | Repeating watermark overlay. |

