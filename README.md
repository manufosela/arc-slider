# \<arc-slider>

Webcomponent arc slider with gradient colors.
This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i arc-slider
```

## Usage

```html
<script type="module">
  import 'arc-slider/arc-slider.js';
</script>

<arc-slider></arc-slider>

<arc-slider id="arcSlider2" max-range="50" min-range="-50" color1="#00FF00" color2="#0000FF"></arc-slider>

<arc-slider id="arcSlider3" max-range="10" min-range="0" arc-value="2" color1="#FFFF00" color2="#800080"></arc-slider>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
