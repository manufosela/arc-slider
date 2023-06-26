import { css } from 'lit';

/**
 * @cssprop --arc-slider-path-color - The color of the slider path.
 * @cssprop --arc-slider-path-width - The width of the slider path.
 * @cssprop --arc-slider-thumb-color - The color of the slider thumb.
 * @cssprop --arc-slider-thumb-size - The size of the slider thumb.
 * @cssprop --arc-slider-label-color - The color of the slider label.
 * @cssprop --arc-slider-label-font-size - The font size of the slider label.
 * @cssprop --arc-slider-label-font-weight - The font weight of the slider label.
 * @cssprop --arc-slider-label-font-family - The font family of the slider label.
 * @cssprop --arc-slider-label-text-shadow - The text shadow of the slider label.
 * @cssprop --arc-slider-label-text-align - The text alignment of the slider label.
 * @cssprop --arc-slider-label-text-transform - The text transformation of the slider label.
 * @cssprop --arc-slider-label-margin-top - The margin top of the slider label.
 * @cssprop --arc-slider-label-margin-bottom - The margin bottom of the slider label.
 * @cssprop --arc-slider-label-margin-left - The margin left of the slider label.
 * @cssprop --arc-slider-label-margin-right - The margin right of the slider label.
 * @cssprop --arc-slider-label-padding-top - The padding top of the slider label.
 * @cssprop --arc-slider-label-padding-bottom - The padding bottom of the slider label.
 * @cssprop --arc-slider-label-padding-left - The padding left of the slider label.
 * @cssprop --arc-slider-label-padding-right - The padding right of the slider label.
 * @cssprop --arc-slider-label-border-radius - The border radius of the slider label.
 * @cssprop --arc-slider-label-background-color - The background color of the slider label.
 * @cssprop --arc-slider-label-box-shadow - The box shadow of the slider label.
 * @cssprop --arc-slider-label-border - The border of the slider label.
 * @cssprop --arc-slider-label-border-style - The border style of the slider label.
 * @cssprop --arc-slider-label-border-color - The border color of the slider label.
 * @cssprop --arc-slider-label-transition - The transition of the slider label.
 * @cssprop --arc-slider-label-z-index - The z-index of the slider label.
 * @cssprop --arc-slider-label-position - The position of the slider label.
 * @cssprop --arc-slider-label-top - The top of the slider label.
 * @cssprop --arc-slider-label-left - The left of the slider label.
 * @cssprop --arc-slider-label-right - The right of the slider label.
 * @cssprop --arc-slider-label-bottom - The bottom of the slider label.
 * 
 */
export const arcSliderStyles = css`
    :host {
    display: block;
    padding: 25px;
    color: var(--arc-slider-text-color, #000);
    }

    .slider-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 12.5em;
        max-width: 100%;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-top:2rem;
    }

    .slider-input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    .slider-thumb {
        --color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        z-index: 1;
        left: calc( var(--slider-value) / 100 * (100% - var(--slider-height)) + var(--slider-height) / 2 );
        transform: translate(-50%, -50%);
        border-radius: 50%;
        width: 1.25em;
        height: 1.25em;
        background-image: linear-gradient(to bottom, #f0f0f2, #d9dade);
        box-shadow: 0 0.0625em 0.0625em rgba(0, 0, 0, 0.3);
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        touch-action: none;
        cursor: pointer;
    }
    .slider-thumb::before {
    content: "";
        position: absolute;
        border-radius: inherit;
        width: 68%;
        height: 68%;
        background-color: var(--color);
        box-shadow: inset 0 -8px 4px rgba(0, 0, 0, 0.1);
    }

    .slider-value-container {
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 0.5em;
        position: absolute;
        bottom: 0;
        transform: translateY(-100%);
        border: 1px solid #dbdbe3;
        border-radius: 5rem;
        padding: 0.25rem 0.75rem;
        background-color: #f2f2f3;
        box-shadow: 0 0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
        font-size: 0.9rem;
        font-feature-settings: "tnum";
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        pointer-events: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .slider-value {
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .slider-svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 1px 0 #fff);
        overflow: visible;
    }

    .slider-svg-path {
        touch-action: none;
        cursor: pointer;
    }`;
