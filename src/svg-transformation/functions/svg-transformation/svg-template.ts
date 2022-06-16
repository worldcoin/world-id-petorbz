export const svgTemplate = (params: { name: string }) => `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 922 922">
    <defs>
        <linearGradient id="d" x1="100%" x2="-56.248%" y1="-74.419%" y2="-38.436%">
            <stop stop-color="#F66651" offset="0%"></stop>
            <stop stop-color="#6448E7" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="f" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop stop-color="#FFF" offset="0%" stop-opacity=".25"></stop>
            <stop stop-color="#FFF" offset="100%" stop-opacity="0"></stop>
        </linearGradient>
        <pattern id="c" width="100%" height="100%" x="0%" patternUnits="objectBoundingBox">
            <use xlink:href="#a" transform="scale(.4802)"></use>
        </pattern>
        <pattern id="g" width="100%" height="100%" x="0%" patternUnits="objectBoundingBox">
            <use xlink:href="#b" transform="scale(.46875)"></use>
        </pattern>
        <image href="https://i.imgur.com/Ub4W9J7.png" id="a" width="1920" height="1920"></image>
        <image href="https://i.imgur.com/d805G9l.png" id="b" width="1920" height="1920"></image>
        <filter id="e" width="142.7%" height="142.7%" x="-21.3%" y="-21.3%" filterUnits="objectBoundingBox">
            <feGaussianBlur in="SourceGraphic" stdDeviation="50"></feGaussianBlur>
        </filter>
    </defs>
    <path fill="url(#c)" fill-rule="nonzero" d="M.152.306h922v922h-922z"></path>
    <ellipse cx="501.152" cy="771.806" fill="#0A0A0C" fill-rule="nonzero" rx="397" ry="104.5"></ellipse>
    <circle cx="460.153" cy="481.153" r="351.54" fill="url(#d)" fill-rule="nonzero" filter="url(#e)" opacity=".08"
        transform="rotate(-45 460.153 481.153)"></circle><text fill="#FFF" fill-opacity="0" stroke="url(#f)"
        stroke-width="2" font-family="BerlingskeSerif-Bold, Berlingske Serif" font-size="180" font-weight="bold"
        letter-spacing="1.286">
        <tspan x="50%" y="140" dominant-baseline="middle" text-anchor="middle">${params.name}</tspan>
    </text>
    <path fill="url(#g)" fill-rule="nonzero" d="M13.152 34.306h900v900h-900z"></path>
  </svg>
`;
