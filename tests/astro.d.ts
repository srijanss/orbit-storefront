// Vite compiles .astro imports into factories for the container tests.
// This describes that compiled boundary; tsc does not check .astro templates.
declare module '*.astro' {
  const component: Parameters<
    import('astro/container').experimental_AstroContainer['renderToString']
  >[0];
  export default component;
}
