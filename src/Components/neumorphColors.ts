/*export const neumorphColors = [
    {
        background: '#1a0b3b',
        backgroundOuter: 'linear-gradient(145deg, #170a35, #1c0c3f)',
        shadows: '22px 22px 49px #0a0418, -22px -22px 49px #2a125e',
        shadowsFocused: 'inset 11px 11px 23px #0a0418, inset -11px -11px 23px #2a125e',
        shadowsHovered: '22px 22px 49px #0a0418',
        innerShadows: '11px 11px 23px #0a0418, -11px -11px 23px #2a125e',
        color: 'rgb(108, 98, 131)',
        hoveredAltBackground: '#ff9605',
        hoveredColor: 'rgb(30, 13, 55)',
        backgroundAltInner: 'linear-gradient(145deg, #ffa105, #e68705)',
        shadowsAlt: '22px 22px 49px #a86303, -22px -22px 49px #ffc907',
        shadowsHoveredAlt: 'inset 22px 22px 49px #a86303, inset -22px -22px 49px #ffc907',
    },
    {
        background: '#f6f7fa',
        backgroundOuter: 'linear-gradient(145deg, #dddee1, #ffffff)',
        shadows: '22px 22px 49px #a2a3a5, -22px -22px 49px #ffffff',
        shadowsFocused: 'inset 11px 11px 23px #a2a3a5, inset -11px -11px 23px #ffffff',
        shadowsHovered: '22px 22px 49px #a2a3a5',
        innerShadows: '11px 11px 23px #a2a3a5, -11px -11px 23px #ffffff',
        color: '#ff9605',
        hoveredAltBackground: '#ff9605',
        hoveredColor: '#f6f7fa',
        backgroundAltInner: 'linear-gradient(145deg, #ffa105, #e68705)',
        shadowsAlt: '22px 22px 49px #a86303, -22px -22px 49px #ffc907',
        shadowsHoveredAlt: 'inset 22px 22px 49px #a86303, inset -22px -22px 49px #ffc907',
    },
    {
        background: '#ff9605',
        backgroundOuter: 'linear-gradient(145deg, #ffa105, #e68705)',
        shadows: '22px 22px 49px #a86303, -22px -22px 49px #ffc907',
        shadowsFocused: 'inset 11px 11px 23px #a86303, inset -11px -11px 23px #ffc907',
        shadowsHovered: '22px 22px 49px #a86303',
        innerShadows: '11px 11px 23px #a86303, -11px -11px 23px #ffc907',
        color: '#f6f7fa',
        hoveredAltBackground: '#f6f7fa',
        hoveredColor: '#ff9605',
        backgroundAltInner: 'linear-gradient(145deg, #dddee1, #ffffff)',
        shadowsAlt: '22px 22px 49px #a2a3a5, -22px -22px 49px #ffffff',
        shadowsHoveredAlt: 'inset 22px 22px 49px #a2a3a5, inset -22px -22px 49px #ffffff',
    }
];*/

export const neumorphColors: Array<NeumorphColorsType> = [
    {
        background: '#B5838D',
        concaveBackground: 'linear-gradient(145deg, #a3767f, #c28c97)',
        shadows: '20px 20px 40px #9a6f78, -20px -20px 40px #d097a2',
        innerShadows: 'inset 20px 20px 40px #9a6f78, inset -20px -20px 40px #d097a2',
        littleShadows: '5px 5px 10px #9a6f78, -5px -5px 10px #d097a2;',
        innerLittleShadows: 'inset 5px 5px 10px #9a6f78, inset -5px -5px 10px #d097a2',
        progressBarColor: '#d097a2',
        color: 'white',
    },{
        background: '#E5989B',
        concaveBackground: 'linear-gradient(145deg, #ce898c, #f5a3a6)',
        shadows: '20px 20px 40px #c38184, -20px -20px 40px #ffafb2',
        innerShadows: 'inset 20px 20px 40px #c38184, inset -20px -20px 40px #ffafb2',
        littleShadows: '5px 5px 10px #c38184, -5px -5px 10px #ffafb2;',
        innerLittleShadows: 'inset 5px 5px 10px #c38184, inset -5px -5px 10px #ffafb2',
        progressBarColor: '#ffafb2',
        color: 'white',
    },{
        background: '#FFB4A2',
        concaveBackground: 'linear-gradient(145deg, #e6a292, #ffc1ad)',
        shadows: '20px 20px 40px #d49586, -20px -20px 40px #ffd3be',
        innerShadows: 'inset 20px 20px 40px #d49586, inset -20px -20px 40px #ffd3be',
        littleShadows: '5px 5px 10px #d49586, -5px -5px 10px #ffd3be;',
        innerLittleShadows: 'inset 5px 5px 10px #d49586, inset -5px -5px 10px #ffd3be',
        progressBarColor: '#ffd3be',
        color: 'white',
    }, {
        background: '#FFCDB2',
        concaveBackground: 'linear-gradient(145deg, #e6b9a0, #ffdbbe)',
        shadows: '20px 20px 40px #d4aa94, -20px -20px 40px #fff0d0',
        innerShadows: 'inset 20px 20px 40px #d4aa94, inset -20px -20px 40px #fff0d0',
        littleShadows: '5px 5px 10px #d4aa94, -5px -5px 10px #fff0d0;',
        innerLittleShadows: 'inset 5px 5px 10px #d4aa94, inset -5px -5px 10px #fff0d0',
        progressBarColor: '#fff0d0',
        color: 'white'
    }
];

export const defaultPalette: NeumorphColorsType = {
    background: '#6D6875',
    concaveBackground: 'linear-gradient(145deg, #625e69, #756f7d)',
    shadows: '20px 20px 40px #5e5965, -20px -20px 40px #7c7785',
    innerShadows: 'inset 20px 20px 40px #5e5965, inset -20px -20px 40px #7c7785',
    littleShadows: '5px 5px 10px #5d5863, -5px -5px 10px #7d7887',
    innerLittleShadows: 'inset 5px 5px 10px #5d5863, inset -5px -5px 10px #7d7887',
    progressBarColor: '#7c7785',
    color: 'white',
};


export type NeumorphColorsType = {
    background: string,
    concaveBackground: string,
    shadows: string,
    innerShadows: string,
    littleShadows: string,
    innerLittleShadows: string,
    progressBarColor: string,
    color: string,
};