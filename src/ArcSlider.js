import { html, LitElement } from 'lit';
import { arcSliderStyles } from './arcSliderStyles.js';

  /**
   * A custom element representing an arc slider.
   *
   * @element arc-slider
   *
   * @attr {String} id - The unique identifier of the element.
   * @attr {Number} max-range - The maximum value of the slider.
   * @attr {Number} min-range - The minimum value of the slider.
   * @attr {Number} arc-value - The current value of the slider.
   * @attr {Number} step - The step value of the slider.
   * @attr {Boolean} disabled - Whether the slider is disabled or not.
   * @attr {String} label - The label of the slider.
   * @attr {Number} middleRange - The middle value of the slider.
   * @attr {String} color1 - The first color of the gradient.
   * @attr {String} color2 - The second color of the gradient.
   * 
   */
export class ArcSlider extends LitElement {
  static get styles() {
    return arcSliderStyles;
  }

  static get properties() {
    return {
      id: { type: String },
      maxRange: { type: Number, attribute: 'max-range' },
      minRange: { type: Number, attribute: 'min-range' },
      arcValue: { type: Number, attribute: 'arc-value', reflect: true },
      step: { type: Number },
      disabled: { type: Boolean },
      label: { type: String },
      middleRange: { type: Number },
      color1: { type: String },
      color2: { type: String },
    };
  }

  constructor() {
    super();
    this.id = Math.random().toString(36).substring(2, 11);
    this.maxRange = 100;
    this.minRange = 0;
    this.step = 1;
    this.middleRange = (this.maxRange - this.minRange) / 2;

    this.color1 = '#FF1122';
    this.color2 = '#1122FF';

    this.sliderMaxValue = 100;
    this.sliderMinValue = 0;
    this.sliderInput = null;
    this.sliderThumb = null;
    this.sliderPath = null;
    this.sliderPathLength = null;
    this.sliderSvg = null;

    // Semaphore
    this.arcValueManualChanged = false;

    this.updatePositionEvent = this.updatePositionEvent.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  /* LIFECYCLE METHODS */
  connectedCallback() {
    super.connectedCallback();
    this.middleRange = (this.maxRange - this.minRange) / 2;
  }

  /* STATIC METHODS */
  static convertRGBtoHexadecimal(color) {
    const red = color.r.toString(16).padStart(2, '0').toUpperCase();
    const green = color.g.toString(16).padStart(2, '0').toUpperCase();
    const blue = color.b.toString(16).padStart(2, '0').toUpperCase();
    const hexadecimalColor = `#${red}${green}${blue}`;
    return hexadecimalColor;
  }

  static calculateGradientColors(color1, color2) {
    const numSteps = 4; // Número de colores intermedios a calcular
    const gradientColors = [];
 
    const r1 = color1.r;
    const g1 = color1.g;
    const b1 = color1.b;
    const r2 = color2.r;
    const g2 = color2.g;
    const b2 = color2.b;
  
    const deltaR = (r2 - r1) / (numSteps + 1);
    const deltaG = (g2 - g1) / (numSteps + 1);
    const deltaB = (b2 - b1) / (numSteps + 1);
  
    for (let i = 1; i <= numSteps; i += 1) {
      const r = Math.round(r1 + deltaR * i);
      const g = Math.round(g1 + deltaG * i);
      const b = Math.round(b1 + deltaB * i);
      gradientColors.push({ r, g, b });
    }
  
    return gradientColors;
  }

  static convertHexadecimalToRGB(_hex) {
    const hex = _hex.replace('#', '');
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      throw new Error('El valor hexadecimal no es válido.');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }

  static detectColorFormat(_color) {
    if (typeof _color !== 'string') {
      throw new Error('El color debe ser una cadena de texto.');
    }
    const color = _color.trim();
    if (color.startsWith('rgb(') && color.endsWith(')')) {
      return 'rgb';
    }
    if (color.startsWith('#') && /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(color.substring(1))) {
      return 'hex';
    }
    throw new Error('Formato de color no reconocido.');
  }

  /* COMPONENT METHODS */

  setColor(progress) {
    const numStops = this.colorStops.length;
    const index = (numStops - 1) * progress;
    const startIndex = Math.floor(index);
    const endIndex = Math.ceil(index);
    const startColor = this.colorStops[startIndex];
    const endColor = this.colorStops[endIndex];
    const percentage = index - startIndex;
    const [r, g, b] = [Math.round(startColor.r + (endColor.r - startColor.r) * percentage), Math.round(startColor.g + (endColor.g - startColor.g) * percentage), Math.round(startColor.b + (endColor.b - startColor.b) * percentage)];
    this.sliderThumb.style.setProperty('--color', `rgb(${r} ${g} ${b})`);
  }

  // updating position could be done with CSS Motion Path instead of absolute positioning but Safari <15.4 doesn’t seem to support it
  updatePosition(progress) {
    const point = this.sliderPath.getPointAtLength(progress * this.sliderPathLength);
    const svgRect = this.sliderSvg.getBoundingClientRect();
    const scaleX = svgRect.width / this.sliderSvg.viewBox.baseVal.width;
    const scaleY = svgRect.height / this.sliderSvg.viewBox.baseVal.height;
    this.sliderThumb.style.left = `${point.x * scaleX * 100 / svgRect.width}%`;
    this.sliderThumb.style.top = `${point.y * scaleY * 100 / svgRect.height}%`;
    const value = Math.round(progress * (this.sliderMaxValue - this.sliderMinValue));
    this.sliderInput.value = String(value);
    this.arcValue = value + this.minRange;  
    this.sliderValue.innerHTML = this.arcValue;
    this.setColor(progress);
    this.arcValueManualChanged = true;
  }

  handlePointerMove(event) {
    const sliderWidth = this.sliderPath.getBoundingClientRect().width;
    const pointerX = event.clientX - this.sliderPath.getBoundingClientRect().left;
    const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
    this.updatePosition(progress);
  };

  handlePointerDown(event) {
    const sliderWidth = this.sliderPath.getBoundingClientRect().width;
    const pointerX = event.clientX - this.sliderPath.getBoundingClientRect().left;
    const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
    const isThumb = event.target.classList.contains('slider-thumb');
    if (!isThumb) this.updatePosition(progress);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', () => {
      window.removeEventListener('pointermove', this.handlePointerMove);
    });
  };

  updatePositionEvent() {
    const progress = this.sliderInput.valueAsNumber / (this.sliderMaxValue - this.sliderMinValue);
    this.updatePosition(progress);
  }

  drawSVGLine() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'slider-svg');
    svg.setAttribute('viewBox', '0 0 238 36');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'slider-svg-path');
    path.setAttribute('d', 'M2 34L7.21879 31.0968C78.5901 -8.60616 165.659 -7.50128 236 34V34');
    path.setAttribute('stroke', 'url(#paint0_linear_339_100980)');
    path.setAttribute('stroke-width', '.25em');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.setAttribute('filter', 'url(#filter0_i_339_100980)');
    svg.appendChild(path);

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'filter0_i_339_100980');
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    defs.appendChild(filter);

    const feFlood = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
    feFlood.setAttribute('flood-opacity', '0');
    feFlood.setAttribute('result', 'BackgroundImageFix');
    filter.appendChild(feFlood);

    const feBlend = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
    feBlend.setAttribute('mode', 'normal');
    feBlend.setAttribute('in', 'SourceGraphic');
    feBlend.setAttribute('in2', 'BackgroundImageFix');
    feBlend.setAttribute('result', 'shape');
    filter.appendChild(feBlend);

    const feColorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    feColorMatrix.setAttribute('in', 'SourceAlpha');
    feColorMatrix.setAttribute('type', 'matrix');
    feColorMatrix.setAttribute('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0');
    feColorMatrix.setAttribute('result', 'hardAlpha');
    filter.appendChild(feColorMatrix);

    const feOffset = document.createElementNS('http://www.w3.org/2000/svg', 'feOffset');
    feOffset.setAttribute('dy', '1');
    filter.appendChild(feOffset);

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '0.5');
    filter.appendChild(feGaussianBlur);

    const feComposite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
    feComposite.setAttribute('in2', 'hardAlpha');
    feComposite.setAttribute('operator', 'arithmetic');
    feComposite.setAttribute('k2', '-1');
    feComposite.setAttribute('k3', '1');
    filter.appendChild(feComposite);

    const feColorMatrix2 = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    feColorMatrix2.setAttribute('type', 'matrix');
    feColorMatrix2.setAttribute('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0');
    filter.appendChild(feColorMatrix2);

    const feBlend2 = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
    feBlend2.setAttribute('mode', 'normal');
    feBlend2.setAttribute('in2', 'shape');
    feBlend2.setAttribute('result', 'effect1_innerShadow_339_100980');
    filter.appendChild(feBlend2);

    const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    linearGradient.setAttribute('id', 'paint0_linear_339_100980');
    linearGradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    defs.appendChild(linearGradient);

    this.colorStops.forEach((color, index) => {
      const hexadecimalColor = ArcSlider.convertRGBtoHexadecimal(color);
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', `${index / (this.colorStops.length - 1)}`);
      stop.setAttribute('stop-color', `${hexadecimalColor}`);
      linearGradient.appendChild(stop);
    });

    svg.appendChild(defs);
    return svg; 
  }

  setColorsStops() {
    const typeColor1 = ArcSlider.detectColorFormat(this.color1);
    const typeColor2 = ArcSlider.detectColorFormat(this.color2);
    if (typeColor1 === 'hex') {
      this.color1 = ArcSlider.convertHexadecimalToRGB(this.color1);
    }
    if (typeColor2 === 'hex') {
      this.color2 = ArcSlider.convertHexadecimalToRGB(this.color2);
    }
    
    this.colorStops = ArcSlider.calculateGradientColors(this.color1, this.color2);
  }

  /* EVENT HANDLERS */
  changeValue(event) {
    const { value } = event.detail;
    this.arcValue = value;
    const progress = this.arcValue / (this.maxRange - this.minRange);
    this.updatePosition(progress);

    this.dispatchEvent(new CustomEvent('change', { detail: { id: this.id, value: this.arcValue } }));
  }

  /* LIFECYCLE METHODS - FINAL */

  updated(changedProperties) {
    if (changedProperties.has('arcValue')) {
      if (!this.arcValueManualChanged ) {
        const valuesAreDefined = changedProperties.get('arcValue') !== undefined && this.arcValue !== undefined;
        const valuesAreInRange = this.arcValue >= this.minRange && this.arcValue <= this.maxRange;
        const valuesAreDifferent = changedProperties.get('arcValue') !== this.arcValue;
        if (valuesAreDifferent && valuesAreDefined && valuesAreInRange) {
          // console.log('last arcValue: ', changedProperties.get('arcValue'));
          // console.log('new arcValue: ', this.arcValue);
          if (this.arcValue < this.minRange && this.arcValue > this.maxRange) {
            this.arcValue = changedProperties.get('arcValue');
          } else {
            this.updatePosition(this.arcValue / (this.sliderMaxValue - this.sliderMinValue));
          }
        }
      } else {
        this.arcValueManualChanged = false;
      }
    }
  }

  firstUpdated() {
    this.middleRange = (this.maxRange - this.minRange) / 2;
    this.arcValue = this.arcValue || this.middleRange;
    this.setColorsStops();

    const svg = this.drawSVGLine();
    this.shadowRoot.querySelector('div.slider-wrapper').insertBefore(svg, this.shadowRoot.querySelector('div.slider-wrapper').firstChild);

    this.sliderSvg = this.shadowRoot.querySelector('.slider-svg');
    this.sliderPath = this.shadowRoot.querySelector('.slider-svg-path');
    this.sliderThumb = this.shadowRoot.querySelector('.slider-thumb');
    this.sliderInput = this.shadowRoot.querySelector('.slider-input');
    this.sliderValue = this.shadowRoot.querySelector('.slider-value');

    this.sliderPathLength = this.sliderPath.getTotalLength();
    this.sliderMinValue = parseInt(this.sliderInput.min, 10) || 0;
    this.sliderMaxValue = parseInt(this.sliderInput.max, 10) || 100;
    this.sliderValue.innerHTML = this.arcValue;
    this.sliderInput.value = this.arcValue;

    this.sliderInput.addEventListener('input', this.updatePositionEvent);
    this.sliderThumb.addEventListener('pointerdown', this.handlePointerDown);
    this.sliderPath.addEventListener('pointerdown', this.handlePointerDown);
    
    this.updatePosition(this.arcValue / (this.sliderMaxValue - this.sliderMinValue));

    document.addEventListener('arc-slider_change-value', this.changeValue);
  }

  render() {
    return html`
      <div class="slider-wrapper">
        <input class="slider-input" type="range" max="${this.maxRange}" min="${this.minRange}" value="String(${this.middleRange})" step="${this.step}">
        <div class="slider-thumb">
          <div class="slider-value-container">
            <p class="slider-value"></p>
          </div>
        </div>
      </div>
    `;
  }
}
