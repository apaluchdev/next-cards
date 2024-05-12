export type Card = {
    Suit: string;
    Value: string;
};

const cardValuesOrder = ["Maybe", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export const sortByCardValue = (a: Card, b: Card) => {
    const aValueIndex = cardValuesOrder.indexOf(a.Value);
    const bValueIndex = cardValuesOrder.indexOf(b.Value);
    return aValueIndex - bValueIndex;
};

export default Card;
