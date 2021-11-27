const linkname = window.location.pathname

var output1 = document.getElementById("ccval");
var output2 = document.getElementById("sval");
var output3 = document.getElementById("eval");

function updateChart(data){
    const diff = ((new Date())-startTime)/1000;

    if (!(DEVICE_IDS.has(data.deviceid))) {
        DEVICE_IDS.add(data.deviceid)

        var conceptclarity = {
            data: [[diff,parseInt(data.conceptclarity)]],
            label: data.deviceid + " c",
            borderColor: "rgba(146, 85, 243, 0.1)"
        };
        var speed = {
            data: [[diff,parseInt(data.speed)]],
            label: data.deviceid + " s",
            borderColor: "rgba(216, 74, 55, 0.1)"
        };
        var engagement = {
            data: [[diff,parseInt(data.engagement)]],
            label: data.deviceid + " e",
            borderColor: "rgba(120, 218, 74, 0.1)"
        };

        chart.data.datasets.push(conceptclarity)
        chart.data.datasets.push(speed);;
        chart.data.datasets.push(engagement);

    } else {
        
        const ci = chart.data.datasets.map(e => e.label).indexOf(data.deviceid+" c")
        const si = chart.data.datasets.map(e => e.label).indexOf(data.deviceid+" s")
        const ei = chart.data.datasets.map(e => e.label).indexOf(data.deviceid+" e")
        chart.data.datasets[ci].data.push([diff, data.conceptclarity])
        chart.data.datasets[si].data.push([diff, data.speed])
        chart.data.datasets[ei].data.push([diff, data.engagement])

    }

    sum_conceptclarity = 0
    sum_speed = 0
    sum_engagement = 0

    chart.data.datasets.slice(3).forEach(element => {
        if (element.label.slice(-1)[0] == "c") {
            sum_conceptclarity += parseInt(element.data.slice(-1)[0][1])
        }
        else if (element.label.slice(-1)[0] == "s") {
            sum_speed += parseInt(element.data.slice(-1)[0][1])
        }
        else {
            sum_engagement += parseInt(element.data.slice(-1)[0][1])
        }
    });

    chart.data.datasets[0].data.push([diff, sum_conceptclarity/Math.max(1, DEVICE_IDS.size)])
    chart.data.datasets[1].data.push([diff, sum_speed/Math.max(1, DEVICE_IDS.size)])
    chart.data.datasets[2].data.push([diff, sum_engagement/Math.max(1, DEVICE_IDS.size)])

    output1.innerHTML = conceptclarity_emojis[Math.round(8-((sum_conceptclarity/Math.max(1, DEVICE_IDS.size)))*8/100)];
    output2.innerHTML = speed_emojis[Math.round(8-((sum_speed/Math.max(1, DEVICE_IDS.size))*8/100))];
    output3.innerHTML = engagement_emojis[Math.round(8-((sum_engagement/Math.max(1, DEVICE_IDS.size))*8/100))];
    
}

conceptclarity_emojis= [
    "💎",
    "😎",
    "🤘",
    "😁",
    "🙂",
    "😕",
    "🤔",
    "😵",
    "❓"
]
speed_emojis= [
    "🏇",
    "🏃‍♂️",
    "⏩",
    "😊",
    "🙂",
    "😕",
    "😪",
    "🐌",
    "🛌"
] 
engagement_emojis= [
    "💯",
    "🧐",
    "✅",
    "😊",
    "🙂",
    "😕",
    "😪",
    "😴",
    "❌"
]     

var socket = io();

var lastupdated = new Date()

socket.on(linkname, (newInfo)=>{
    if (!(newInfo.notification=="")) {
        alert(newInfo.notification);
    }

    updateChart(newInfo)

    if(new Date() - lastupdated > 200){ 
        lastupdated = new Date()
        chart.update()    
    }
})
