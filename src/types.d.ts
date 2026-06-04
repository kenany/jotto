declare module 'jots' {
  function jots(word: string, guess: string): number;
  export = jots;
}

declare module 'humanize-number' {
  function humanize(n: number): string;
  export = humanize;
}

declare module 'printf' {
  function printf(format: string, ...args: unknown[]): string;
  export = printf;
}

declare module 'sowpods-five' {
  const words: string[];
  export = words;
}

declare module 'sowpods-six' {
  const words: string[];
  export = words;
}
