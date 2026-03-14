function calcEarnings(n, theatres, pubs, commercials) {
    var timeUsed = 0;
    var total = 0;

    //theatres 
    for (var i = 0; i < theatres; i++) {
        timeUsed += 5;
        total += 1500 * (n - timeUsed);
    }

    //pubs
    for (var j = 0; j < pubs; j++) {
        timeUsed += 4;
        total += 1000 * (n - timeUsed);
    }

    //parks
    for (var k = 0; k < commercials; k++) {
        timeUsed += 10;
        total += 2000 * (n - timeUsed);
    }

    return total;
}


function maxProfit(n) {
    var bestEarnings = 0;
    var solutions = [];

    var maxT = Math.floor(n / 5);
    var maxP = Math.floor(n / 4);
    var maxC = Math.floor(n / 10);

    for (var t = 0; t <= maxT; t++) {
        for (var p = 0; p <= maxP; p++) {
            for (var c = 0; c <= maxC; c++) {

                var buildTime = (5 * t) + (4 * p) + (10 * c);

                if (buildTime === 0 || buildTime >= n) continue;

                var earned = calcEarnings(n, t, p, c);

                if (earned > bestEarnings) {
                    bestEarnings = earned;
                    solutions = [{ t: t, p: p, c: c }];
                } else if (earned === bestEarnings) {
                    solutions.push({ t: t, p: p, c: c });
                }
            }
        }
    }

    console.log("Earnings: $" + bestEarnings);
    console.log("Solutions:");
    for (var s = 0; s < solutions.length; s++) {
        var sol = solutions[s];
        console.log((s + 1) + ". T: " + sol.t + " P: " + sol.p + " C: " + sol.c);
    }
}


console.log("Time Unit: 7");
maxProfit(7);

console.log("\nTime Unit: 8");
maxProfit(8);

console.log("\nTime Unit: 49");
maxProfit(49);
