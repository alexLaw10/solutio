declare module '@solutio-v2/solutio-ds/loader' {
  export interface CustomElementsDefineOptions {
    exclude?: string[];
    resourcesUrl?: string;
    syncQueue?: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
    jmp?: (c: Function) => any; // Stencil's internal jump function type
    raf?: (c: FrameRequestCallback) => number;
    ael?: (
      el: EventTarget,
      eventName: string,
      listener: EventListenerOrEventListenerObject,
      options: boolean | AddEventListenerOptions
    ) => void;
    rel?: (
      el: EventTarget,
      eventName: string,
      listener: EventListenerOrEventListenerObject,
      options: boolean | AddEventListenerOptions
    ) => void;
  }

  export function defineCustomElements(
    win?: Window,
    opts?: CustomElementsDefineOptions
  ): void;
}
