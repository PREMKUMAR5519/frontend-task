function MaxProfit(totalTime) {
    const projects = [
        { name: "T", units: 5, earnings: 1500 },
        { name: "P", units: 4, earnings: 1000 },
        { name: "C", units: 10, earnings: 2000 }
    ];

    const Best = [];
    const Temp = [];

    for (let i = 0; i <= totalTime; i++) {
        Best[i] = null;
        Temp[i] = [];
    }

    Best[0] = 0;
    Temp[0] = [{ T: 0, P: 0, C: 0 }];

    for (let j = 0; j <= totalTime; j++) {

        for (const project of projects) {
            const finishTime = j + project.units;

            if (finishTime >= totalTime) continue;

            const projectProfit = project.earnings * (totalTime - finishTime);
            const totalProfit = Best[j] + projectProfit;

            const newOne = Temp[j].map(plan => ({
                T: plan.T + (project.name === "T" ? 1 : 0),
                P: plan.P + (project.name === "P" ? 1 : 0),
                C: plan.C + (project.name === "C" ? 1 : 0)
            }));

            if (Best[finishTime] === null || totalProfit > Best[finishTime]) {

                Best[finishTime] = totalProfit;
                Temp[finishTime] = newOne;
            } else if (totalProfit === Best[finishTime]) {
                Temp[finishTime].push(...newOne);
            }
        }
    }

    let maxProfit = 0;
    let bestOne = [];

    for (let time = 0; time <= totalTime; time++) {

        if (Best[time] > maxProfit) {
            maxProfit = Best[time];
            bestOne = [...Temp[time]];
        } else if (Best[time] === maxProfit) {
            bestOne.push(...Temp[time]);
        }
    }

    const Temp2 = [];
    const checked = new Set();

    for (const plan of bestOne) {
        const id = `${plan.T}-${plan.P}-${plan.C}`;
        if (!checked.has(id)) {
            checked.add(id);
            Temp2.push(plan);
        }
    }

    Temp2.sort((a, b) => {
        if (a.T !== b.T) return b.T - a.T;
        if (a.P !== b.P) return b.P - a.P;
        return b.C - a.C;
    });

    console.log(`Time Unit: ${totalTime}`);
    console.log(`earnings: $${maxProfit}`);
    console.log("Solutions");
    Temp2.forEach((plan, index) => {
        console.log(`${index + 1}. T: ${plan.T} P: ${plan.P} C: ${plan.C}`);
    });

    // console.log("Best", Best)
    // console.log("Temp", Temp)

    return {
        earnings: maxProfit,
        solutions: Temp2
    };

}

// Test cases
MaxProfit(7);
MaxProfit(8);
MaxProfit(13);