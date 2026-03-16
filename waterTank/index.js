let input = document.getElementById("heights-input");
let btn = document.getElementById("compute-btn");
let errorMsg = document.getElementById("error-msg");
let resultSection = document.getElementById("result");
let waterCount = document.getElementById("water-count");
let svg = document.getElementById("tank-svg");

btn.addEventListener("click", run);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") run();
});

run();


function computeWater(heights) {
    let n = heights.length;
    if (n < 3) return Array(n).fill(0);

    let maxLeft = [heights[0]];
    for (let i = 1; i < n; i++) {
        maxLeft[i] = Math.max(maxLeft[i - 1], heights[i]);
    }

    let maxRight = [];
    maxRight[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        maxRight[i] = Math.max(maxRight[i + 1], heights[i]);
    }

    return heights.map((h, i) => Math.min(maxLeft[i], maxRight[i]) - h);
}


function drawGrid(heights, water) {
    let cols = heights.length;

    let maxH = 0;
    for (let i = 0; i < cols; i++) {
        let top = heights[i] + water[i];
        if (top > maxH) maxH = top;
    }
    maxH += 1;

    let cellW = 64, cellH = 30;
    let svgW = cols * cellW;
    let svgH = maxH * cellH;

    svg.setAttribute("width", svgW);
    svg.setAttribute("height", svgH);
    svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
    svg.innerHTML = "";

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < maxH; row++) {
            let level = maxH - row;

            let cssClass = "cell-empty";
            if (level <= heights[col]) cssClass = "cell-block";
            else if (level <= heights[col] + water[col]) cssClass = "cell-water";

            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", col * cellW);
            rect.setAttribute("y", row * cellH);
            rect.setAttribute("width", cellW);
            rect.setAttribute("height", cellH);
            rect.setAttribute("class", cssClass);
            svg.appendChild(rect);
        }
    }
}


function run() {
    errorMsg.classList.add("hidden");

    let raw = input.value.split(",");
    let heights = [];

    for (let i = 0; i < raw.length; i++) {
        let str = raw[i].trim();
        if (str === "") continue;
        let num = Number(str);
        if (isNaN(num) || num < 0 || num % 1 !== 0) {
            errorMsg.textContent = `"${str}" isn't a valid height — use non-negative whole numbers.`;
            errorMsg.classList.remove("hidden");
            resultSection.classList.add("hidden");
            return;
        }
        heights.push(num);
    }

    if (heights.length < 2) {
        errorMsg.textContent = "Need at least 2 values.";
        errorMsg.classList.remove("hidden");
        resultSection.classList.add("hidden");
        return;
    }

    let water = computeWater(heights);
    let total = water.reduce((sum, w) => sum + w, 0);

    waterCount.textContent = total;
    resultSection.classList.remove("hidden");
    drawGrid(heights, water);
}
