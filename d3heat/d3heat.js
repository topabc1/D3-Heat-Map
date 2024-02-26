document.addEventListener("DOMContentLoaded", () => {

    async function Fetch() {
        const res = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");
        let data = await res.json();
        const baseTemp = data.baseTemperature;
        data = data.monthlyVariance;
    
        const w = 1500; // canvas width
        const h = 600; // canvas height
        const p = 100; // canvas padding
        
        const svg = d3.select("#container").append("svg").attr("width", w).attr("height", h);
    
    svg.selectAll("rect").data(data).enter().append("rect").attr("x", (d) => p + (w - 2 * p) / (data.length / 12) * (d.year - d3.min(data, (d) => d.year))).attr("y", (d) => p + (h - 2 * p) / 12 * (d.month % 12)).attr("height", (h - 2 * p) / 12).attr("width", (w - 2 * p) / (data.length / 12)).attr("class", "cell").attr("fill", (d) => { if(baseTemp + Number(d.variance) < 2.8) { return "#002A84"; } else if(baseTemp + Number(d.variance) < 3.9) { return "#3359A9"; } else if(baseTemp + Number(d.variance) < 5.0) { return "#5C7EC4"; } else if(baseTemp + Number(d.variance) < 6.1) { return "#AFC0E6"; } else if(baseTemp + Number(d.variance) < 7.2) { return "#C1D4FD"; } else if(baseTemp + Number(d.variance) < 8.3) { return "#FDF9C1"; } else if(baseTemp + Number(d.variance) < 9.5) { return "#C8AC5C"; } else if(baseTemp + Number(d.variance) < 10.6) { return "#AD7A35"; } else if(baseTemp + Number(d.variance) < 11.7) { return "#945C0F"; } else if(baseTemp + Number(d.variance) < 12.8) { return "#B03A3A"; } else { return "#AA0000"; } });
        
        const xScale = d3.scaleLinear().domain([d3.min(data, (d) => d.year), d3.max(data, (d) => d.year)]).range([p, w - p]);
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickValues([1760, 1770, 1780, 1790, 1800, 1810, 1820, 1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010]);
        svg.append("g").call(xAxis).attr("id", "x-axis").attr("transform", `translate(0, ${h - p})`);
        
        const yScale = d3.scaleLinear().domain([12, 0]).range([h - p, p]);
        const yAxis = d3.axisLeft(yScale).tickValues([0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5]).tickFormat((d, i) => ["November", "October", "September", "August", "July", "June", "May", "April", "March", "February", "January", "December"].reverse()[i]);
        svg.append("g").call(yAxis).attr("id", "y-axis").attr("transform", `translate(${p}, 0)`);
    
    svg.select("div").data(data).enter().append("div").attr("class", "tooltip").style("margin-left", (d) => `calc(${p + (w - 2 * p) / (data.length / 12) * (d.year - d3.min(data, (d) => d.year))}px + 30px`).style("margin-top", (d) => `calc(${p + (h - 2 * p) / 12 * (d.month % 12)}px - 680px)`);
        
        const tooltip = Array.from(document.querySelectorAll(".tooltip"));
        const cell = Array.from(document.querySelectorAll(".cell"));
    
        tooltip.forEach((item, index) => {
            if(data[index].month == 1) {
                data[index].month = "January";
            } else if(data[index].month == 2) {
                data[index].month = "February";
            } else if(data[index].month == 3) {
                data[index].month = "March";
            } else if(data[index].month == 4) {
                data[index].month = "April";
            } else if(data[index].month == 5) {
                data[index].month = "May";
            } else if(data[index].month == 6) {
                data[index].month = "June";
            } else if(data[index].month == 7) {
                data[index].month = "July";
            } else if(data[index].month == 8) {
                data[index].month = "August";
            } else if(data[index].month == 9) {
                data[index].month = "September";
            } else if(data[index].month == 10) {
                data[index].month = "October";
            } else if(data[index].month == 11) {
                data[index].month = "November";
            } else if(data[index].month == 12) {
                data[index].month = "December";
            }
            item.innerHTML = `${data[index].year} - ${data[index].month}<br />${(baseTemp + data[index].variance).toFixed(1)}℃<br />${(data[index].variance).toFixed(1)}℃`;
        });
        
        cell.forEach((item, index) => {
            item.addEventListener("mouseenter", () => {
                tooltip[index].style.display = "block";
            });
        });
        
        cell.forEach((item, index) => {
            item.addEventListener("mouseleave", () => {
                tooltip[index].style.display = "none";
            });
        });
        
        const legend = d3.select("#legend").append("svg").attr("height", 60).attr("width", 460);
        
        data = [{ id: 0, fill: "#002A84" }, { id: 1, fill: "#3359A9" }, { id: 2, fill: "#5C7EC4" }, { id: 3, fill: "#AFC0E6" }, { id: 4, fill: "#C1D4FD" }, { id: 5, fill: "#FDF9C1" }, { id: 6, fill: "#C8AC5C" }, { id: 7, fill: "#AD7A35" }, { id: 8, fill: "#945C0F" }, { id: 9, fill: "#B03A3A" }, { id: 10, fill: "#AA0000" }];
        
        legend.selectAll("rect").data(data).enter().append("rect").attr("x", (d) => d.id * 40 + 10).attr("y", 0).attr("width", 40).attr("height", 40).attr("fill", (d) => d.fill).attr("class", "legend");
        
        const legendXScale = d3.scaleLinear().domain([0, 11]).range([10, 450]);
        const legendXAxis = d3.axisBottom(legendXScale).tickFormat((d, i) => ["", 2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8, ""][i]);;
        legend.append("g").call(legendXAxis).attr("transform", "translate(0, 40)");
    }
    Fetch();

})