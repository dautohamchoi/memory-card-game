function calculateLevel(totalScore) {
    if (totalScore < 600) {
        return 1;
    } else if (totalScore >= 600 && totalScore < 1200) {
        return 2;
    } else if (totalScore >= 1200 && totalScore < 2400) {
        return 3;
    } else if (totalScore >= 2400 && totalScore < 4000) {
        return 4;
    } else if (totalScore >= 4000 && totalScore < 7000) {
        return 5;
    } else if (totalScore >= 7000 && totalScore < 10000) {
        return 6;
    } else if (totalScore >= 10000 && totalScore < 14000) {
        return 7;
    } else if (totalScore >= 14000 && totalScore < 18000) {
        return 8;
    } else if (totalScore >= 18000 && totalScore < 21000) {
        return 9;
    } else if (totalScore >= 21000 && totalScore < 24000) {
        return 10;
    } else if (totalScore >= 24000 && totalScore < 28000) {
        return 11;
    } else if (totalScore >= 28000 && totalScore < 32000) {
        return 12;
    } else if (totalScore >= 32000 && totalScore < 40000) {
        return 13;
    } else if (totalScore >= 40000 && totalScore < 50000) {
        return 14;
    } else if (totalScore >= 50000 && totalScore < 60000) {
        return 15;
    } else if (totalScore >= 60000 && totalScore < 70000) {
        return 16;
    } else if (totalScore >= 70000 && totalScore < 85000) {
        return 17;
    } else if (totalScore >= 85000 && totalScore < 100000) {
        return 18;
    } else if (totalScore >= 100000 && totalScore < 120000) {
        return 19;
    }  else if (totalScore >= 120000 && totalScore < 150000) {
        return 20;
    } else if (totalScore >= 150000 && totalScore < 180000) {
        return 21;
    } else if (totalScore >= 180000 && totalScore < 210000) {
        return 22;
    }  else if (totalScore >= 210000 && totalScore < 250000) {
        return 23;
    } else if (totalScore >= 250000 && totalScore < 300000) {
        return 24;
    } else if (totalScore >= 300000) {
        return 25;
    } else {
        return 0;
    }
}

export default calculateLevel;