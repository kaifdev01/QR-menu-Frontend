export const getFontFamily = (fontId) => {
  const fontMap = {
    inter: 'var(--font-inter)',
    poppins: 'var(--font-poppins)',
    playfair: 'var(--font-playfair)',
    montserrat: 'var(--font-montserrat)',
    roboto: 'var(--font-roboto)',
    lora: 'var(--font-lora)',
    opensans: 'var(--font-opensans)',
    merriweather: 'var(--font-merriweather)',
    raleway: 'var(--font-raleway)',
    nunito: 'var(--font-nunito)',
    crimson: 'var(--font-crimson)'
  };
  
  return fontMap[fontId] || fontMap.inter;
};
