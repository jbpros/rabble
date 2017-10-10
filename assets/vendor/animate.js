// DOM utils
// =========

const getElements = elements => {
  if (Array.isArray(elements))
    return elements;
  if (elements.nodeType)
    return [elements];
  return Array.from(typeof elements == "string" ? document.querySelectorAll(elements) : elements);
};


// logic utils
// ===========

const first = ([item]) => item;

const isFunction = operand => typeof operand == "function";


// animation utils
// ===============

const trackTime = (timing, now) => {
  if (!timing.startTime) timing.startTime = now;
  timing.elapsed = now - timing.startTime;
};

const clearDelay = (timing, now) => {
  timing.startTime = now;
  timing.delay = timing.elapsed = 0;
};

const getProgress = ({elapsed, duration}) =>
  duration > 0 ? Math.min(elapsed / duration, 1) : 1;


// easing equations
// ================

const pi2 = Math.PI * 2;

const getOffset = (strength, period) =>
  period / pi2 * Math.asin(1 / strength);

const easings = {
  "linear": progress => progress,

  "in-cubic": progress => progress ** 3,
  "in-quartic": progress => progress ** 4,
  "in-quintic": progress => progress ** 5,
  "in-exponential": progress => 1024 ** (progress - 1),
  "in-circular": progress => 1 - Math.sqrt(1 - progress ** 2),
  "in-elastic": (progress, amplitude, period) => {
    const strength = Math.max(amplitude, 1);
    const offset = getOffset(strength, period);
		return -(strength * 2 ** (10 * (progress -= 1)) * Math.sin((progress - offset) * pi2 / period));
  },

  "out-cubic": progress => --progress ** 3 + 1,
  "out-quartic": progress => 1 - --progress ** 4,
  "out-quintic": progress => --progress ** 5 + 1,
  "out-exponential": progress => 1 - 2 ** (-10 * progress),
  "out-circular": progress => Math.sqrt(1 - --progress ** 2),
  "out-elastic": (progress, amplitude, period) => {
    const strength = Math.max(amplitude, 1);
    const offset = getOffset(strength, period);
    return strength * 2 ** (-10 * progress) * Math.sin((progress - offset) * pi2 / period) + 1;
  },

  "in-out-cubic": progress =>
    (progress *= 2) < 1
      ? .5 * progress ** 3
      : .5 * ((progress -= 2) * progress ** 2 + 2),
  "in-out-quartic": progress =>
    (progress *= 2) < 1
      ? .5 * progress ** 4
      : -.5 * ((progress -= 2) * progress ** 3 - 2),
  "in-out-quintic": progress =>
    (progress *= 2) < 1
      ? .5 * progress ** 5
      : .5 * ((progress -= 2) * progress ** 4 + 2),
  "in-out-exponential": progress =>
    (progress *= 2) < 1
      ? .5 * 1024 ** (progress - 1)
      : .5 * (-(2 ** (-10 * (progress - 1))) + 2),
  "in-out-circular": progress =>
    (progress *= 2) < 1
      ? -.5 * (Math.sqrt(1 - progress ** 2) - 1)
      : .5 * (Math.sqrt(1 - (progress -= 2) * progress) + 1),
  "in-out-elastic": (progress, amplitude, period) => {
    const strength = Math.max(amplitude, 1);
    const offset = getOffset(strength, period);
		return (progress *= 2) < 1
			? -.5 * (strength * 2 ** (10 * (progress -= 1)) * Math.sin((progress - offset) * pi2 / period))
			: strength * 2 ** (-10 * (progress -= 1)) * Math.sin((progress - offset) * pi2 / period) * .5 + 1;
  }
};

const decomposeEasing = string => {
  const [easing, amplitude = 1, period = .4] = string.trim().split(" ");
  return {easing, amplitude, period};
};

const ease = ({easing, amplitude, period}, progress) =>
  easings[easing](progress, amplitude, period);


// keyframes composition
// =====================

const extractRegExp = /-?\d*\.?\d+/g;

const extractStrings = value =>
  String(value).split(extractRegExp);

const extractNumbers = value =>
  String(value).match(extractRegExp).map(Number);

const addPropertyKeyframes = (property, values) => {
  const strings = extractStrings(first(values));
  const numbers = values.map(extractNumbers);
  const round = first(strings).startsWith("rgb");
  return {property, strings, numbers, round};
};

const createAnimationKeyframes = (keyframes, index) =>
  Object.entries(keyframes).map(([property, values]) =>
    addPropertyKeyframes(property, isFunction(values) ? values(index) : values));

const getCurrentValue = (from, to, easing) =>
  from + (to - from) * easing;

const recomposeValue = ([from, to], strings, round, easing) =>
  strings.reduce((style, string, index) => {
    const previous = index - 1;
    const value = getCurrentValue(from[previous], to[previous], easing);
    return style + (round && index < 4 ? Math.round(value) : value) + string;
  });

const createStyles = (keyframes, easing) =>
  keyframes.reduce((styles, {property, numbers, strings, round}) => {
    styles[property] = recomposeValue(numbers, strings, round, easing);
    return styles;
  }, {});

const reverseKeyframes = keyframes =>
  keyframes.forEach(({numbers}) => numbers.reverse());


// animation tracking
// ==================

const animations = new Set;

const addAnimations = (options, resolve) => {
  const {
    elements = "body *",
    easing = "out-elastic",
    duration = 1000,
    delay = 0,
    loop = false,
    direction = "normal",
    ...rest
  } = options;

  let last;
  let maxDuration = -1;

  getElements(elements).forEach((element, index) => {
    const animation = {
      element,
      loop,
      direction,
      easing: decomposeEasing(easing),
      delay: isFunction(delay) ? delay(index) : delay,
      duration: isFunction(duration) ? duration(index) : duration,
      keyframes: createAnimationKeyframes(rest, index)
    };
    const totalDuration = animation.delay + animation.duration;

    if (direction != "normal")
      reverseKeyframes(animation.keyframes);

    if (totalDuration > maxDuration) {
      last = animation;
      maxDuration = totalDuration;
    }

    animations.add(animation);
  });

  last.end = resolve;
  last.options = options;
};


// exports
// =======

export default options => new Promise(resolve => {
  const running = animations.size;
  addAnimations(options, resolve);

  if (running) return;

  const tick = now => {
    animations.forEach(animation => {
      const {element, keyframes, loop, direction, easing, end} = animation;
      trackTime(animation, now);

      if (animation.delay > 0) {
        if (animation.elapsed < animation.delay) return;
        clearDelay(animation, now);
      }

      const progress = getProgress(animation);
      let curve = progress;

      switch (progress) {
        case 0:
          if (direction == "alternate") reverseKeyframes(keyframes);
          break;
        case 1:
          loop ? animation.startTime = 0 : animations.delete(animation);
          if (end) end(animation.options);
          break;
        default:
          curve = ease(easing, progress);
      }

      const styles = createStyles(keyframes, curve);
      Object.assign(element.style, styles);
    });

    if (animations.size) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
});

export const stop = (elements = "body *") => {
  const nodes = getElements(elements);
  animations.forEach(animation => {
    if (nodes.includes(animation.element)) animations.delete(animation);
  });
  return nodes;
};