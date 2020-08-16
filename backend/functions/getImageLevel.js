exports.getImageLevel = function (totalScore) {
    if (totalScore < 600) {
        return "/images/Medal_Ranked_Bronze_5.png";
    } else if (totalScore >= 600 && totalScore < 1200) {
        return "/images/Medal_Ranked_Bronze_4.png";
    } else if (totalScore >= 1200 && totalScore < 2400) {
        return "/images/Medal_Ranked_Bronze_3.png";
    } else if (totalScore >= 2400 && totalScore < 4000) {
        return "/images/Medal_Ranked_Bronze_2.png";
    } else if (totalScore >= 4000 && totalScore < 7000) {
        return "/images/Medal_Ranked_Bronze_1.png";
    } else if (totalScore >= 7000 && totalScore < 10000) {
        return "/images/Medal_Ranked_Silver_5.png";
    } else if (totalScore >= 10000 && totalScore < 14000) {
        return "/images/Medal_Ranked_Silver_4.png";
    } else if (totalScore >= 14000 && totalScore < 18000) {
        return "/images/Medal_Ranked_Silver_3.png";
    } else if (totalScore >= 18000 && totalScore < 21000) {
        return "/images/Medal_Ranked_Silver_2.png";
    } else if (totalScore >= 21000 && totalScore < 24000) {
        return "/images/Medal_Ranked_Silver_1.png";
    } else if (totalScore >= 24000 && totalScore < 28000) {
        return "/images/Medal_Ranked_Gold_5.png";
    } else if (totalScore >= 28000 && totalScore < 32000) {
        return "/images/Medal_Ranked_Gold_4.png";
    } else if (totalScore >= 32000 && totalScore < 40000) {
        return "/images/Medal_Ranked_Gold_3.png";
    } else if (totalScore >= 40000 && totalScore < 50000) {
        return "/images/Medal_Ranked_Gold_2.png";
    } else if (totalScore >= 50000 && totalScore < 60000) {
        return "/images/Medal_Ranked_Gold_1.png";
    } else if (totalScore >= 60000 && totalScore < 70000) {
        return "/images/Medal_Ranked_Platinum_5.png";
    } else if (totalScore >= 70000 && totalScore < 85000) {
        return "/images/Medal_Ranked_Platinum_4.png";
    } else if (totalScore >= 85000 && totalScore < 100000) {
        return "/images/Medal_Ranked_Platinum_3.png";
    } else if (totalScore >= 100000 && totalScore < 120000) {
        return "/images/Medal_Ranked_Platinum_2.png";
    }  else if (totalScore >= 120000 && totalScore < 150000) {
        return "/images/Medal_Ranked_Platinum_1.png";
    } else if (totalScore >= 150000 && totalScore < 180000) {
        return "/images/Medal_Ranked_Diamond_5.png";
    } else if (totalScore >= 180000 && totalScore < 210000) {
        return "/images/Medal_Ranked_Diamond_4.png";
    }  else if (totalScore >= 210000 && totalScore < 250000) {
        return "/images/Medal_Ranked_Diamond_3.png";
    } else if (totalScore >= 250000 && totalScore < 300000) {
        return "/images/Medal_Ranked_Diamond_2.png";
    } else if (totalScore >= 300000) {
        return "/images/Medal_Ranked_Diamond_1.png";
    } else {
        return 0;
    }
}
