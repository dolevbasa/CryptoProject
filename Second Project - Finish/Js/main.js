function getAllCoins() {
  var coinData = localStorage.getItem("Coins");
  var parseCoins = JSON.parse(coinData);
  console.log(parseCoins);
}

function selectCoin(selectCoins) {
  localStorage.setItem("Coins", JSON.stringify(selectCoins));
}

// function unselectCoin(coinId) {
//     const selectedCoins = getAllCoins();
//     const newSelectedCoins = selectedCoins.filter((x) => x !== coinId);
//     window.localStorage.setItem(JSON.stringify(newSelectedCoins)); // Del items
// }
// News
const selectCoins = JSON.parse(localStorage.getItem("Coins"));
let allData = [];
const showCoins = getAllCoins();
let chartsData = {};
let chart;
let latestSelectedCoin = "";
$(function () {
  loadingPage(); //Start Load
});
loadingPage("done");
// load ajax
$.ajax({
  url: "https://api.coingecko.com/api/v3/coins",
  success: (cards) => {
    allData = cards;
    cardInfo();
  },
});
// End ....

// Card Create
function cardInfo() {
  const cards = allData;
  let myHTML = "";
  for (let i = 0; i < cards.length; i++) {
    let checked = "";
    if (selectCoins.indexOf(cards[i].symbol) !== -1) {
      checked = "checked";
    }
    myHTML += `
        <div class="card col-12 col-md-6 col-lg-4 text-center" style="width: 18rem;">
            <div class="card-body">
            <label class="switch">
            <input type="checkbox" ${checked} onclick="toggleCoin(this,'${cards[i].symbol}')">
            <span class="slider round"></span>
            </label>
            <h5 class="card-title">${cards[i].name}</h5>
            <hr>
            <p class="card-text">${cards[i].symbol}</p>
            <button class="btn btn-success" data-toggle="collapse" data-target="#collapseExample${i}">More Info</button>
            <div class="collapse" id="collapseExample${i}">
            <div class="card card-body images">
            <img src="${cards[i].image.large}" alt="coinImg">
            ${cards[i].market_data.current_price.eur}€<br>
            ${cards[i].market_data.current_price.usd}$<br>
            ${cards[i].market_data.current_price.ils}₪<br>
        </div>
            </div>
            </div>
            </div>
        `;
    $(".mycards").html(myHTML);
  }
  loadingPage("done"); //Stop Load
  // End ....
  // More Pages //
  $("#liveReports").click(async function () {
    loadingPage(); //Start Load
    const response = await fetch("livereport.html");
    const html = await response.text();
    $(".nextdiv").html(html);
    createChart();
    loadingPage("done"); //Stop Load
  });
  $("#about").click(async function () {
    loadingPage(); //Start Load
    const response = await fetch("about.html");
    const html = await response.text();
    $(".nextdiv").html(html);
    loadingPage("done"); //Stop Load
  });
  // End .....
  // Search Sys
  $("#searchInfo").click(function (e) {
    e.preventDefault();
    let myHTML = "";
    const data = $("#values").val();
    loadingPage();
    if (data == "") {
      alert("You Need Search Something :)");
    } else {
      $.ajax({
        url: `https://api.coingecko.com/api/v3/coins/${data}`,
        success: function (cards) {
          console.log(cards.symbol);
          let checked = "";
          if (selectCoins.indexOf(cards.symbol) !== -1) {
            checked = "checked";
          }
          $(".mycards").empty();
          myHTML += `
                <div class="card cardpos row col-lg-4 col-12 d-inline-block text-center">
                <div class="card-body">
                <label class="switch">
                <input type="checkbox" ${checked} onclick="toggleCoin(this,'${cards.symbol}')">
                <span class="slider round"></span>
                </label>
                <h5 class="card-title">${cards.name}</h5>
                <hr>
                <p class="card-text">${cards.symbol}</p>
                <button class="btn btn-success" data-toggle="collapse" data-target="#collapseExample">More Info</button>
                <div class="collapse" id="collapseExample">
                <div class="card card-body images">
                <img src="${cards.image.large}" alt="coinImg">
                ${cards.market_data.current_price.eur}€<br>
                ${cards.market_data.current_price.usd}$<br>
                ${cards.market_data.current_price.ils}₪<br>
            </div>
            </div>
            </div>
            </div>
        `;
          $(".mycards").html(myHTML);
        },
        error: function () {
          alert("Cannot find this coin :( Try again");
        },
      });
    }
    loadingPage("done");
  });
  // End ......
  // Live Reports
  // Data Here
  //End ....
}

function toggleCoin(el, symbol) {
  if (el.checked === true && selectCoins.length === 5) {
    el.checked = false;
    latestSelectedCoin = symbol;
    let myHTML = "";
    for (let i = 0; i < selectCoins.length; i++) {
      const currCoinSymbol = selectCoins[i];
      const currCoin = allData.find((coin) => coin.symbol === currCoinSymbol);
      myHTML += `<div class="card col-12 col-md-6 col-lg-4 text-center" style="width: 18rem;">
            <div class="card-body">
                <label class="switch">
                <input type="checkbox" checked onclick="toggleCoin(this,'${currCoin.symbol}'); cardInfo()">
                <span class="slider round"></span>
                </label>
                <h5 class="card-title">${currCoin.name}</h5>
                <hr>
                <p class="card-text">${currCoin.symbol}</p>
            </div>
        </div>`;
    }
    $(".modal-body").html(myHTML);
    $("#myModal").modal("show");
    return;
  }

  if (selectCoins.includes(symbol)) {
    const index = selectCoins.indexOf(symbol);
    selectCoins.splice(index, 1);
  } else {
    selectCoins.push(symbol);
  }
  selectCoin(selectCoins);

  console.log("selectedCoins", selectCoins);
}
function onSaveModal() {
  if (latestSelectedCoin && selectCoins.length < 5) {
    selectCoins.push(latestSelectedCoin);
    localStorage.setItem("Coins", JSON.stringify(selectCoins));
    latestSelectedCoin = "";
    cardInfo();
  }
}

function loadingPage(status) {
  status
    ? $(".screen").remove()
    : $("body").append(
        '<div class="screen"><div class="loadimg-screens"><img src="images/loading.gif" class="loadimg-screen" alt=""></div></div>'
      );
}

const createChart = () => {
  $.ajax({
    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${selectCoins.join(
      ","
    )}&tsyms=USD,EUR$api_key=767fcb4fa4f239d141bbc774069cb70c14971ad503b4f2e3f6c416ec37ed38b1`,
    success: (response) => {
      console.log(response);
      let chartData = [];
      for (let keys in response) {
        chartsData[keys] = {
          type: "splineArea",
          showInLegend: true,
          name: keys,
          yValueFormatString: "$#,##0",
          xValueFormatString: "MMM YYYY",
          dataPoints: [{ x: new Date(), y: response[keys].USD }],
        };
        chartData.push(chartsData[keys]);
      }
      const options = {
        animationEnabled: true,
        theme: "dark1",
        title: {
          text: "Live Reports: 2022 - 2023",
        },
        axisY: {
          includeZero: false,
          prefix: "$",
          lineThickness: 0,
        },
        toolTip: {
          shared: true,
        },
        legend: {
          fontSize: 13,
        },
        data: chartData,
      };
      chart = new CanvasJS.Chart("chartContainer", options);
      chart.render();
      chartsInterval = setInterval(() => {
        updateChart();
      }, 2000);
      console.log("response", response);
    },
  });
};
function updateChart() {
  $.ajax({
    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${selectCoins.join(
      ","
    )}&tsyms=USD,EUR$api_key=767fcb4fa4f239d141bbc774069cb70c14971ad503b4f2e3f6c416ec37ed38b1`,
    success: function (response) {
      let i = 0;
      for (let key in response) {
        const currCoin = response[key];
        chart.options.data[i].dataPoints.push({
          x: new Date(),
          y: response[key].USD,
        });
        i++;
      }
      chart.render();
    },
  });
}
