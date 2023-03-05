import { LoyaltyLevel } from 'types/types';

const loyaltyData: {
    level: LoyaltyLevel;
    label: string;
    emoji: string;
    minPercentage: number;
    maxPercentage: number;
}[] = [
    {
        level: LoyaltyLevel.TierOne,
        label: 'King',
        emoji: '👑',
        minPercentage: 100,
        maxPercentage: 100,
    },
    {
        level: LoyaltyLevel.TierTwo,
        label: 'Loyal',
        emoji: '🫡',
        minPercentage: 75,
        maxPercentage: 99,
    },
    {
        level: LoyaltyLevel.TierThree,
        label: 'Ape',
        emoji: '🦍',
        minPercentage: 50,
        maxPercentage: 74,
    },
    {
        level: LoyaltyLevel.TierFour,
        label: 'NPC',
        emoji: '🤖',
        minPercentage: 25,
        maxPercentage: 49,
    },
    {
        level: LoyaltyLevel.TierFive,
        label: 'Troll',
        emoji: '🧌',
        minPercentage: 1,
        maxPercentage: 24,
    },
    {
        level: LoyaltyLevel.TierSix,
        label: 'Shit',
        emoji: '💩',
        minPercentage: 0,
        maxPercentage: 0,
    },
];

export const getLoyalty = (percentage: number) => {
    const loyalty = loyaltyData.find(
        (loyalty) =>
            percentage >= loyalty.minPercentage &&
            percentage <= loyalty.maxPercentage
    );

    return loyalty;
};
