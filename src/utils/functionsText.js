export const splitTextOnWords = (text, amountWords) => {
    const arrayWords = text.split(' ');
    let string = '';
    if(amountWords < arrayWords.length){
        for (let i = 0; i < amountWords; i++){
            string += `${arrayWords[i]} `;
        }
        return string;
    }else{
        for (let i = 0; i < arrayWords.length; i++){
            string += `${arrayWords[i]} `;
        }
        return string;
    }
};