/* @ds-bundle: {"format":3,"namespace":"NewpageDesignSystem_9bff4f","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"ServiceCard","sourcePath":"components/core/ServiceCard.jsx"},{"name":"StatBlock","sourcePath":"components/core/StatBlock.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Button.jsx":"45a376f934a7","components/core/Card.jsx":"58cab4da92ae","components/core/Eyebrow.jsx":"73b39f4aebed","components/core/IconButton.jsx":"3713b1e75d5d","components/core/Input.jsx":"7101ec1eb9bf","components/core/ServiceCard.jsx":"09accb986a73","components/core/StatBlock.jsx":"baad708bd50a","components/core/Tag.jsx":"d90234b64217","ui_kits/website/app.jsx":"e57e5a41a0b0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NewpageDesignSystem_9bff4f = window.NewpageDesignSystem_9bff4f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Newpage Button — primary action control.
 * Display-font label (Space Grotesk 600), 10px radius, calm ease-out states.
 */
function Button({
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'right',
  disabled = false,
  href,
  onClick,
  children,
  style = {},
  ...rest
}) {
  const pad = size === 'lg' ? '15px 28px' : size === 'sm' ? '9px 16px' : '13px 24px';
  const fs = size === 'lg' ? '16px' : size === 'sm' ? '13.5px' : '15px';
  const variants = {
    primary: {
      background: 'var(--np-teal)',
      color: 'var(--np-teal-ink)',
      border: '1.5px solid transparent'
    },
    inverse: {
      background: 'var(--np-teal-ink)',
      color: '#fff',
      border: '1.5px solid transparent'
    },
    outline: {
      background: 'transparent',
      color: 'var(--np-teal-ink)',
      border: '1.5px solid var(--np-teal-ink)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--np-deep-teal)',
      border: '1.5px solid transparent',
      padding: 0
    },
    link: {
      background: 'transparent',
      color: 'var(--np-deep-teal)',
      border: 'none',
      padding: 0
    }
  };
  const v = variants[variant] || variants.primary;
  const isText = variant === 'ghost' || variant === 'link';
  const base = {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: fs,
    lineHeight: 1,
    padding: isText ? 0 : pad,
    borderRadius: 'var(--radius-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textDecoration: 'none',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur) var(--ease), transform var(--dur-fast) var(--ease), opacity var(--dur) var(--ease)',
    whiteSpace: 'nowrap',
    ...v,
    ...style
  };
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  if (!disabled && hover) {
    if (variant === 'primary') base.background = 'var(--accent-hover)';
    if (variant === 'inverse') base.background = '#0A413E';
    if (variant === 'outline') base.background = 'rgba(6,48,46,0.05)';
    if (isText) base.opacity = 0.7;
  }
  if (!disabled && press && !isText) base.transform = 'scale(0.97)';
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, icon && iconPosition === 'left' && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon), children, icon && iconPosition === 'right' && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, icon));
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    onClick: disabled ? undefined : onClick,
    style: base,
    ...rest
  };
  if (href && !disabled) return /*#__PURE__*/React.createElement("a", _extends({
    href: href
  }, handlers), content);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled
  }, handlers), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Newpage Card — neutral surface container with generous padding.
 * `tone="inverse"` flips to the teal-ink surface. `interactive` adds lift on hover.
 */
function Card({
  tone = 'paper',
  radius = 'md',
  interactive = false,
  padding = 28,
  children,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const radii = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)'
  };
  const inverse = tone === 'inverse';
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: inverse ? 'var(--np-teal-ink)' : 'var(--np-paper)',
      color: inverse ? 'var(--text-on-inverse)' : 'var(--np-teal-ink)',
      borderRadius: radii[radius] || radii.md,
      padding: typeof padding === 'number' ? `${padding}px` : padding,
      boxShadow: interactive && hover ? 'var(--shadow-lifted)' : 'var(--shadow-soft)',
      transform: interactive && hover ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Newpage Eyebrow — mono uppercase kicker above headings.
 * Optional numeric index (e.g. "01") in the section-header style.
 */
function Eyebrow({
  index,
  color = 'var(--np-deep-teal)',
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color,
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '12px',
      ...style
    }
  }, rest), index != null && /*#__PURE__*/React.createElement("span", {
    style: {
      letterSpacing: 0
    }
  }, index), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Newpage IconButton — square icon-only control.
 */
function IconButton({
  icon,
  variant = 'ghost',
  size = 40,
  label,
  onClick,
  disabled,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    ghost: {
      background: hover ? 'var(--np-mist)' : 'transparent',
      color: 'var(--np-teal-ink)',
      border: '1px solid transparent'
    },
    outline: {
      background: hover ? 'var(--np-mist)' : 'var(--np-paper)',
      color: 'var(--np-teal-ink)',
      border: '1px solid var(--np-line)'
    },
    solid: {
      background: hover ? 'var(--accent-hover)' : 'var(--np-teal)',
      color: 'var(--np-teal-ink)',
      border: '1px solid transparent'
    }
  };
  const v = variants[variant] || variants.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur) var(--ease)',
      ...v,
      ...style
    }
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Newpage Input — text field with teal focus ring. Supports label + optional error.
 */
function Input({
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  error,
  disabled,
  onChange,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = error ? 'var(--np-danger)' : focus ? 'var(--np-teal)' : 'var(--np-line)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--np-graphite)',
      marginBottom: 7
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--np-teal-ink)',
      background: disabled ? 'var(--np-mist)' : 'var(--np-paper)',
      padding: '12px 14px',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      boxShadow: focus && !error ? '0 0 0 3px rgba(8,189,184,0.18)' : 'none',
      transition: 'border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)',
      boxSizing: 'border-box'
    }
  }, rest)), error && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 12.5,
      color: 'var(--np-danger)',
      marginTop: 6
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/ServiceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Newpage ServiceCard — the signature teal-ink offering card:
 * icon well, title, description, and a "Discover more" link.
 */
function ServiceCard({
  icon,
  title,
  description,
  action = 'Discover more',
  href,
  tone = 'inverse',
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const inverse = tone === 'inverse';
  const fg = inverse ? 'rgba(247,248,250,0.7)' : 'var(--np-slate)';
  const head = inverse ? '#F7F8FA' : 'var(--np-teal-ink)';
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: onClick,
    style: {
      background: inverse ? 'var(--np-teal-ink)' : 'var(--np-paper)',
      borderRadius: 'var(--radius-lg)',
      padding: '30px',
      boxShadow: inverse ? 'none' : hover ? 'var(--shadow-lifted)' : 'var(--shadow-soft)',
      transform: hover ? 'translateY(-3px)' : 'none',
      transition: 'transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease)',
      cursor: href || onClick ? 'pointer' : 'default',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 12,
      background: inverse ? 'rgba(8,189,184,0.15)' : 'var(--np-teal-tint)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 22,
      color: 'var(--np-teal)'
    }
  }, icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 22,
      lineHeight: 1.15,
      margin: '0 0 10px',
      color: head
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14.5,
      lineHeight: 1.55,
      color: fg,
      margin: '0 0 20px'
    }
  }, description), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      color: inverse ? 'var(--np-teal)' : 'var(--np-deep-teal)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      opacity: hover ? 0.85 : 1,
      transition: 'opacity var(--dur) var(--ease)'
    }
  }, action, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: hover ? 'translateX(3px)' : 'none',
      transition: 'transform var(--dur) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 6l6 6-6 6"
  }))));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/core/StatBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Newpage StatBlock — oversized Space Grotesk metric with a teal accent suffix.
 */
function StatBlock({
  value,
  suffix = '+',
  label,
  align = 'left',
  size = 46,
  color = 'var(--np-teal-ink)',
  labelColor = 'var(--np-slate)',
  accent = 'var(--np-teal)',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '-1.5px',
      lineHeight: 1,
      color
    }
  }, value, suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent
    }
  }, suffix)), label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: labelColor,
      marginTop: 6
    }
  }, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Newpage Tag — pill for technologies, capabilities, categories.
 */
function Tag({
  tone = 'teal',
  children,
  style = {},
  ...rest
}) {
  const tones = {
    teal: {
      background: 'var(--np-teal-tint)',
      color: 'var(--np-teal-700)',
      font: 'var(--font-body)',
      weight: 500
    },
    neutral: {
      background: '#F0F2F5',
      color: 'var(--np-slate)',
      font: 'var(--font-body)',
      weight: 500
    },
    dark: {
      background: 'var(--np-teal-ink)',
      color: 'var(--np-teal)',
      font: 'var(--font-mono)',
      weight: 500
    }
  };
  const t = tones[tone] || tones.teal;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: t.font,
      fontWeight: t.weight,
      fontSize: tone === 'dark' ? '12px' : '13px',
      letterSpacing: tone === 'dark' ? '0.5px' : 0,
      background: t.background,
      color: t.color,
      padding: tone === 'dark' ? '7px 13px' : '7px 14px',
      borderRadius: 'var(--radius-pill)',
      display: 'inline-block',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/app.jsx
try { (() => {
/* Newpage marketing website — UI kit sections.
   Composes the design-system primitives from window.NewpageDesignSystem_9bff4f.
   Lucide supplies line icons (brand icon style). */
(function () {
  const NS = window.NewpageDesignSystem_9bff4f || {};
  const {
    Button,
    Tag,
    Card,
    ServiceCard,
    StatBlock,
    Eyebrow,
    Input,
    IconButton
  } = NS;

  // --- Lucide icon helper -------------------------------------------------
  function Icon({
    name,
    size = 20,
    color,
    strokeWidth = 1.75,
    style
  }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!ref.current || !window.lucide) return;
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          'stroke-width': strokeWidth
        }
      });
    }, [name, size, strokeWidth]);
    return /*#__PURE__*/React.createElement("span", {
      ref: ref,
      style: {
        display: 'inline-flex',
        color,
        ...style
      }
    });
  }
  const arrow = (s = 16) => /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: s
  });
  const wrap = {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '0 40px'
  };

  // --- THEME TOGGLE -------------------------------------------------------
  function ThemeToggle({
    theme,
    setTheme
  }) {
    const opts = [{
      k: 'deep-teal',
      l: 'Deep Teal'
    }, {
      k: 'editorial',
      l: 'Editorial'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        background: 'var(--np-mist)',
        border: '1px solid var(--np-line)',
        borderRadius: 'var(--radius-pill)',
        padding: 3
      }
    }, opts.map(o => {
      const on = theme === o.k;
      return /*#__PURE__*/React.createElement("button", {
        key: o.k,
        type: "button",
        onClick: () => setTheme(o.k),
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 12px',
          background: on ? 'var(--np-teal-ink)' : 'transparent',
          color: on ? 'var(--np-teal)' : 'var(--np-cool-gray)',
          transition: 'background var(--dur) var(--ease), color var(--dur) var(--ease)'
        }
      }, o.l);
    }));
  }

  // --- NAV ----------------------------------------------------------------
  function Nav({
    onContact,
    theme,
    setTheme
  }) {
    const [open, setOpen] = React.useState(false);
    const links = ['Services', 'Solutions', 'Engagement', 'About', 'Insights'];
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.86)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--np-line)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/newpage-logo-color.png",
      alt: "Newpage",
      style: {
        height: 26
      }
    }), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        gap: 30
      }
    }, links.map(l => /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      onClick: e => e.preventDefault(),
      style: {
        fontSize: 15,
        color: 'var(--np-graphite)',
        textDecoration: 'none',
        fontWeight: 500
      }
    }, l))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(ThemeToggle, {
      theme: theme,
      setTheme: setTheme
    }), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "primary",
      icon: arrow(15),
      onClick: onContact
    }, "Contact us"))));
  }

  // --- HERO ---------------------------------------------------------------
  function Hero({
    onContact,
    theme
  }) {
    const dark = theme !== 'editorial';
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--hero-surface)',
        color: 'var(--hero-ink)',
        position: 'relative',
        overflow: 'hidden'
      }
    }, dark ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -120,
        bottom: -160,
        width: 460,
        height: 460,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(8,189,184,0.22), transparent 62%)',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: "../../assets/newpage-arrowhead-tint.png",
      alt: "",
      style: {
        position: 'absolute',
        right: -40,
        top: -20,
        width: 320,
        opacity: 0.5,
        pointerEvents: 'none'
      }
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        opacity: 0.6,
        backgroundImage: 'radial-gradient(#C9CDC4 1.2px, transparent 1.2px)',
        backgroundSize: '22px 22px',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: "../../assets/newpage-arrowhead.png",
      alt: "",
      style: {
        position: 'absolute',
        right: 40,
        bottom: -40,
        width: 240,
        opacity: 0.9,
        pointerEvents: 'none'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        padding: '92px 40px 100px',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      color: "var(--hero-eyebrow)"
    }, "Trusted IT partner for Life Sciences"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 64,
        lineHeight: 1.03,
        letterSpacing: '-2px',
        margin: '20px 0 22px',
        maxWidth: 880
      }
    }, "Transform life sciences with AI & digital solutions that deliver breakthroughs"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 20,
        lineHeight: 1.5,
        color: 'var(--hero-ink-muted)',
        maxWidth: 620,
        margin: '0 0 36px'
      }
    }, "We solve enterprise IT challenges for pharma and biotech \u2014 from Salesforce/Veeva and Adobe to AI, cloud, and digital health."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "primary",
      icon: arrow(17)
    }, "Explore AI solutions"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: dark ? 'outline' : 'inverse',
      style: dark ? {
        color: '#fff',
        borderColor: 'rgba(255,255,255,0.4)'
      } : {},
      onClick: onContact
    }, "Talk to us")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 44,
        marginTop: 64
      }
    }, /*#__PURE__*/React.createElement(StatBlock, {
      value: "200",
      suffix: "+",
      label: "Projects delivered",
      size: 40,
      color: "var(--hero-ink)",
      labelColor: "var(--hero-ink-muted)"
    }), /*#__PURE__*/React.createElement(StatBlock, {
      value: "27",
      suffix: "+",
      label: "Countries deployed",
      size: 40,
      color: "var(--hero-ink)",
      labelColor: "var(--hero-ink-muted)"
    }), /*#__PURE__*/React.createElement(StatBlock, {
      value: "60",
      suffix: "+",
      label: "Brands supported",
      size: 40,
      color: "var(--hero-ink)",
      labelColor: "var(--hero-ink-muted)"
    }))));
  }

  // --- LOGO STRIP ---------------------------------------------------------
  function TrustStrip() {
    const techs = ['Salesforce', 'Veeva', 'Adobe AEM', 'AWS', 'Azure', 'Databricks'];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--np-paper)',
        borderBottom: '1px solid var(--np-line)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        padding: '26px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: 'var(--np-cool-gray)'
      }
    }, "Platform expertise"), techs.map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 17,
        color: 'var(--np-graphite)',
        opacity: 0.7
      }
    }, t))));
  }

  // --- SERVICES -----------------------------------------------------------
  function Services() {
    const items = [{
      icon: 'brain-circuit',
      title: 'Data & AI',
      desc: 'Boost productivity with scalable data and AI solutions across your organization.'
    }, {
      icon: 'sparkles',
      title: 'Salesforce & Veeva',
      desc: 'Drive engagement with personalized, self-service omnichannel CRM experiences.'
    }, {
      icon: 'heart-pulse',
      title: 'Digital Health',
      desc: 'Engage and empower customers throughout their care journey, end to end.'
    }, {
      icon: 'layout-dashboard',
      title: 'Adobe Experience',
      desc: 'AEM, Workfront and Franklin — content velocity for regulated marketing teams.'
    }, {
      icon: 'cloud',
      title: 'Cloud & DevOps',
      desc: 'Design and deploy scalable cloud-native solutions that drive transformation.'
    }, {
      icon: 'users-round',
      title: 'Team Augmentation',
      desc: 'Expand your team with top-tier life-sciences engineering talent on demand.'
    }];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        padding: '92px 40px'
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      index: "01"
    }, "What we do"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 38,
        letterSpacing: '-1px',
        margin: '12px 0 14px',
        color: 'var(--np-teal-ink)'
      }
    }, "Enterprise IT, engineered for regulated industries"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 18,
        lineHeight: 1.55,
        color: 'var(--np-slate)',
        maxWidth: 640,
        margin: '0 0 44px'
      }
    }, "From strategy to deployment, we partner at every stage of your digital transformation journey."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20
      }
    }, items.map(it => /*#__PURE__*/React.createElement(ServiceCard, {
      key: it.title,
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: it.icon,
        size: 26
      }),
      title: it.title,
      description: it.desc
    })))));
  }

  // --- ENGAGEMENT MODELS --------------------------------------------------
  function Engagement() {
    const models = [{
      t: 'GCC / ODC',
      d: 'Dedicated offshore development centers, set up and run for you.'
    }, {
      t: 'Strategic augmentation',
      d: 'Plug expert engineers into your existing teams, fast.'
    }, {
      t: 'Managed teams',
      d: 'Outcome-based, remote-first distributed delivery teams.'
    }, {
      t: 'Advisory',
      d: 'AI and data strategy, cloud and ML Ops consulting.'
    }];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--np-paper)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        padding: '92px 40px'
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      index: "02"
    }, "How we engage"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 38,
        letterSpacing: '-1px',
        margin: '12px 0 44px',
        color: 'var(--np-teal-ink)'
      }
    }, "Flexible delivery models"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20
      }
    }, models.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: m.t,
      style: {
        borderTop: '2px solid var(--np-teal)',
        paddingTop: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--np-cool-gray)'
      }
    }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 19,
        margin: '10px 0 8px',
        color: 'var(--np-teal-ink)'
      }
    }, m.t), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14.5,
        lineHeight: 1.55,
        color: 'var(--np-slate)',
        margin: 0
      }
    }, m.d))))));
  }

  // --- CASE STUDY ---------------------------------------------------------
  function CaseStudy() {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        padding: '92px 40px'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      tone: "inverse",
      radius: "lg",
      padding: 0,
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '56px 56px 52px'
      }
    }, /*#__PURE__*/React.createElement(Tag, {
      tone: "dark",
      style: {
        marginBottom: 22
      }
    }, "Case study \xB7 AI / CRM"), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: '-1px',
        lineHeight: 1.15,
        color: '#fff',
        margin: '0 0 18px'
      }
    }, "An AI Salesforce chatbot that cut L1 ticket resolution from four days to under five minutes"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 16,
        lineHeight: 1.6,
        color: 'rgba(247,248,250,0.72)',
        margin: '0 0 28px',
        maxWidth: 460
      }
    }, "Full automation of L1 support tickets \u2014 slashing resolution times, reducing costs, and scaling support effortlessly across the enterprise."), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: arrow(16)
    }, "Read the case study")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(8,189,184,0.10)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        padding: '56px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 30
      }
    }, /*#__PURE__*/React.createElement(StatBlock, {
      value: "4 days",
      suffix: "",
      label: "",
      size: 40,
      color: "#fff"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: 'var(--np-teal)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-down",
      size: 22,
      color: "var(--np-teal)"
    }), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: 1,
        color: 'rgba(247,248,250,0.6)'
      }
    }, "RESOLUTION TIME")), /*#__PURE__*/React.createElement(StatBlock, {
      value: "<5 min",
      suffix: "",
      label: "",
      size: 40,
      color: "var(--np-teal)"
    }))))));
  }

  // --- CTA ----------------------------------------------------------------
  function CTA({
    onContact
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--np-paper)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        padding: '40px 40px 96px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--np-teal-tint)',
        borderRadius: 'var(--radius-lg)',
        padding: '56px 56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 32,
        letterSpacing: '-1px',
        color: 'var(--np-teal-ink)',
        margin: '0 0 10px'
      }
    }, "Ready to deliver breakthroughs?"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 17,
        color: 'var(--np-teal-700)',
        margin: 0
      }
    }, "Tell us about your project \u2014 we'll get back within one business day.")), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "inverse",
      icon: arrow(17),
      onClick: onContact
    }, "Contact us"))));
  }

  // --- FOOTER -------------------------------------------------------------
  function Footer() {
    const cols = [{
      h: 'Services',
      items: ['Data & AI', 'Salesforce / Veeva', 'Adobe Experience', 'Digital Health', 'Cloud & DevOps']
    }, {
      h: 'Company',
      items: ['About us', 'Careers', 'Insights', 'Contact']
    }, {
      h: 'Centers',
      items: ['Chennai · Newton Center', 'Bangalore · Einstein Center', 'Miami, FL', 'Sanford, NC']
    }];
    return /*#__PURE__*/React.createElement("footer", {
      style: {
        background: 'var(--np-teal-ink)',
        color: 'var(--text-on-inverse)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        padding: '64px 40px 40px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: 32
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/newpage-logo-white.png",
      alt: "Newpage",
      style: {
        height: 30,
        marginBottom: 18
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14.5,
        lineHeight: 1.6,
        color: 'rgba(247,248,250,0.6)',
        maxWidth: 260,
        margin: '0 0 18px'
      }
    }, "Trusted IT partner for Life Sciences. Remote-first, Net Zero certified."), /*#__PURE__*/React.createElement(Tag, {
      tone: "dark"
    }, "Net Zero \xB7 2025")), cols.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.h
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: 'var(--np-teal)',
        marginBottom: 16
      }
    }, c.h), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 11
      }
    }, c.items.map(i => /*#__PURE__*/React.createElement("a", {
      key: i,
      href: "#",
      onClick: e => e.preventDefault(),
      style: {
        fontSize: 14.5,
        color: 'rgba(247,248,250,0.72)',
        textDecoration: 'none'
      }
    }, i)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid rgba(255,255,255,0.12)',
        marginTop: 48,
        paddingTop: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'rgba(247,248,250,0.45)'
      }
    }, "\xA9 2026 Newpage Solutions"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'rgba(247,248,250,0.45)'
      }
    }, "Deliver breakthroughs"))));
  }

  // --- CONTACT MODAL ------------------------------------------------------
  function ContactModal({
    open,
    onClose
  }) {
    const [sent, setSent] = React.useState(false);
    React.useEffect(() => {
      if (open) setSent(false);
    }, [open]);
    if (!open) return null;
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(6,48,46,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: {
        background: 'var(--np-paper)',
        borderRadius: 'var(--radius-lg)',
        padding: 40,
        width: 460,
        maxWidth: '100%',
        boxShadow: 'var(--shadow-lifted)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Contact us"), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: '-0.5px',
        color: 'var(--np-teal-ink)',
        margin: '10px 0 0'
      }
    }, "Let's talk")), /*#__PURE__*/React.createElement(IconButton, {
      variant: "ghost",
      label: "Close",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "x",
        size: 20
      }),
      onClick: onClose
    })), sent ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '24px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: 'var(--np-deep-teal)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check-circle-2",
      size: 28,
      color: "var(--np-deep-teal)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        color: 'var(--np-teal-ink)'
      }
    }, "Thanks \u2014 we'll be in touch within one business day.")) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Full name",
      placeholder: "Jane Doe"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Work email",
      type: "email",
      placeholder: "jane@biopharma.com"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "How can we help?",
      placeholder: "A few words about your project"
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: arrow(16),
      onClick: () => setSent(true),
      style: {
        marginTop: 4,
        justifyContent: 'center'
      }
    }, "Send message"))));
  }

  // --- APP ----------------------------------------------------------------
  function App() {
    const [contact, setContact] = React.useState(false);
    const [theme, setTheme] = React.useState('deep-teal');
    const open = () => setContact(true);
    return /*#__PURE__*/React.createElement("div", {
      "data-theme": theme,
      style: {
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement(Nav, {
      onContact: open,
      theme: theme,
      setTheme: setTheme
    }), /*#__PURE__*/React.createElement(Hero, {
      onContact: open,
      theme: theme
    }), /*#__PURE__*/React.createElement(TrustStrip, null), /*#__PURE__*/React.createElement(Services, null), /*#__PURE__*/React.createElement(Engagement, null), /*#__PURE__*/React.createElement(CaseStudy, null), /*#__PURE__*/React.createElement(CTA, {
      onContact: open
    }), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(ContactModal, {
      open: contact,
      onClose: () => setContact(false)
    }));
  }
  window.NewpageSite = {
    App
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.Tag = __ds_scope.Tag;

})();
