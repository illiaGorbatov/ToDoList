
export const neumorphColors: Array<NeumorphColorsType> = [
    {
        background: '#F9DCC4',
        concaveBackground: 'linear-gradient(145deg, #e0c6b0, #ffebd2)',
        shadows: '14px 14px 35px #c2ac99, -14px -14px 35px #ffffef',
        innerShadows: 'inset 14px 14px 35px #c2ac99, inset -14px -14px 35px #ffffef',
        littleShadows: '5px 5px 10px #c2ac99, -5px -5px 10px #ffffef',
        innerLittleShadows: 'inset 5px 5px 10px #c2ac99, inset -5px -5px 10px #ffffef',
        progressBarColor: '#ffffef',
        progressBarHoverColor: '#c2ac99',
        color: '#141718'
    },
    {
        background: '#F8EDEB',
        concaveBackground: 'linear-gradient(145deg, #dfd5d4, #fffefb)',
        shadows: '14px 14px 35px #c1b9b7, -14px -14px 35px #ffffff',
        innerShadows: 'inset 14px 14px 35px #c1b9b7, inset -14px -14px 35px #ffffff',
        littleShadows: '5px 5px 10px #c1b9b7, -5px -5px 10px #ffffff',
        innerLittleShadows: 'inset 5px 5px 10px #c1b9b7, inset -5px -5px 10px #ffffff',
        progressBarColor: '#ffffff',
        progressBarHoverColor: '#c1b9b7',
        color: '#141718'
    },
    {
        background: '#FCD5CE',
        concaveBackground: 'linear-gradient(145deg, #e3c0b9, #ffe4dc)',
        shadows: '14px 14px 35px #c5a6a1, -14px -14px 35px #fffffb',
        innerShadows: 'inset 14px 14px 35px #c5a6a1, inset -14px -14px 35px #fffffb',
        littleShadows: '5px 5px 10px #c5a6a1, -5px -5px 10px #fffffb',
        innerLittleShadows: 'inset 5px 5px 10px #c5a6a1, inset -5px -5px 10px #fffffb',
        progressBarColor: '#fffffb',
        progressBarHoverColor: '#c5a6a1',
        color: '#141718'
    },
    {
        background: '#FFB5A7',
        concaveBackground: 'linear-gradient(145deg, #e6a396, #ffc2b3)',
        shadows: '14px 14px 35px #c78d82, -14px -14px 35px #ffddcc',
        innerShadows: 'inset 14px 14px 35px #c78d82, inset -14px -14px 35px #ffddcc',
        littleShadows: '5px 5px 10px #c78d82, -5px -5px 10px #ffddcc',
        innerLittleShadows: 'inset 5px 5px 10px #c78d82, inset -5px -5px 10px #ffddcc',
        progressBarColor: '#ffddcc',
        progressBarHoverColor: '#c78d82',
        color: '#141718'
    }
];

/*export const defaultPalette: NeumorphColorsType = {
    background: '#FDA85D',
    concaveBackground: 'linear-gradient(145deg, #e49754, #ffb464)',
    shadows: '14px 14px 35px #c58349, -14px -14px 35px #ffcd71',
    innerShadows: 'inset 14px 14px 35px #c58349, inset -14px -14px 35px #ffcd71',
    littleShadows: '5px 5px 10px #c58349, -5px -5px 10px #ffcd71',
    color: '#141718',
    innerLittleShadows: 'inset 5px 5px 10px #c58349, inset -5px -5px 10px #ffcd71',
    progressBarColor: '#ffcd71',
    progressBarHoverColor: '#c58349',
    default: true
};*/

export const defaultPalette: NeumorphColorsType = {
    background: '#EAE8DE',
    concaveBackground: ' linear-gradient(145deg, #d3d1c8, #faf8ee)',
    shadows: '14px 14px 35px #b9b7af, -14px -14px 35px #ffffff',
    innerShadows: 'inset 14px 14px 35px #b9b7af, inset -14px -14px 35px #ffffff',
    littleShadows: '5px 5px 10px #b9b7af, -5px -5px 10px #ffffff',
    color: '#141718',
    innerLittleShadows: 'inset 5px 5px 10px #b9b7af, inset -5px -5px 10px #ffffff',
    progressBarColor: '#ffffff',
    progressBarHoverColor: '#b9b7af',
    default: true
};

export type NeumorphColorsType = {
    background: string,
    concaveBackground: string,
    shadows: string,
    innerShadows: string,
    littleShadows: string,
    innerLittleShadows: string,
    progressBarColor: string,
    progressBarHoverColor: string,
    color: string,
    default?: boolean
};