import { sleep, } from './sleep';

export const Async = (async () => {}).constructor;

export const aliveRun = async ({ src, timeout, }) => {
  if (src instanceof Async) {
    const fail = () => Promise.reject({ race: true, timeout, });
    const result = await Promise.race([
      src(),
      sleep(timeout).then(fail),
    ]);
    return { ...result, race: true, src, timeout, };
  } else if (src instanceof URL) {
    const act = async() => {
        const response = await fetch(src);
        const text = await response.text();
        return { text, };
    };
    const result = await aliveRun({ src: act, timeout, });
    return { ...result, src, };
  } else if (typeof src === 'string') {
    const url = new URL(src, location.href);
    const result = await aliveRun({ src: url, timeout, });
    return { ...result, src, };
  }
  return Promise.reject({ race: false, src, timeout, });
};

export const aliveMatch = async ({ src, match, timeout, }) => {
  const result = await aliveRun({ src, timeout, });
  if (match instanceof Async) {
    const matched = await match({ ...result });
    return { ...result, match, matched, };
  } else if (match instanceof Function) {
    const matched = match({ ...result });
    return { ...result, match, matched, };
  } else if (typeof match === 'string') {
    const { text } = result;
    if (text === match) {
      return { ...result, match, matched: true, };
    } else {
      return Promise.reject({ ...result, match, matched: false, });
    }
  }
  return result;
};

export const alive = async ({ src, timeout, }) => {
  if (src instanceof Array && src.length) {
    const [ first, ...tail ] = src;
    try {
      const result = await alive({ src: first, timeout, });
      return { ...result, };
    } catch (error) {
      const result = await alive({ src: tail, timeout, });
      return { ...result, };
    }  
  } else if (src instanceof Object) {
    const result = await aliveMatch({ ...src, timeout, });
    return result;
  }
  const result = await aliveRun({ src, timeout, });
  return result;
};
