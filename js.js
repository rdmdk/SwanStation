let m = document.getElementById("m");
let s = document.getElementById("s");
let mm = localStorage.minute ? localStorage.minute : 108;
let ss = localStorage.second ? localStorage.second : 00;
var silenced = false;

function minutes() {
	let a = mm.toString().split("");
	let b = mm < 100 && mm >= 10 ? "<span>0</span>" : mm < 10 && mm >= 0 ? "<span>0</span><span>0</span>" : "";
	m.innerHTML = b;
	a.forEach((c) => m.insertAdjacentHTML("beforeend", "<span>" + c + "</span>"));
}

function seconds() {
	let a = ss.toString().split("");
	let b = ss < 10 ? "<span>0</span>" : "";
	s.innerHTML = b;
	a.forEach((c) => s.insertAdjacentHTML("beforeend", "<span>" + c + "</span>"));
}

function sounds() {
	const alarm = new Audio("alarm.mp3");
	const beep = new Audio("beep.mp3");
	const crash = new Audio("crash.mp3");
	const tick = new Audio("tick.mp3");
	alarm.volume = 0.5;
	beep.volume = 0.5;
	crash.volume = 1;
	tick.volume = 0.25;

	const ai = setInterval(() => {
		if (document.hidden || silenced) {}
		else tick.play();
		setTimeout(() => {
			tick.pause();
			tick.currentTime = 0;
		}, 975);
	}, 1e3);
	const bi = setInterval(() => {
		if (mm < 4) {
			if (document.hidden || silenced) {}
			else beep.play();
			setTimeout(() => {
				beep.pause();
				beep.currentTime = 0;
			}, 1975);
		}
	}, 2e3);
	const ci = setInterval(() => {
		if (mm < 1) {
			clearInterval(bi);
			if (document.hidden || silenced) {}
			else alarm.play();
			setTimeout(() => {
				alarm.pause();
				alarm.currentTime = 0;
			}, 1975);
		}
	}, 2e3);
	const di = setInterval(() => {
		if (mm <= 0 && ss <= 10) {
			clearInterval(ci);
			if (document.hidden || silenced) {}
			else alarm.play();
			setTimeout(() => {
				alarm.pause();
				alarm.currentTime = 0;
			}, 990);
		}
	}, 1e3);
	const ei = setInterval(() => {
		if (mm <= 0 && ss <= 0) {
			clearInterval(ai);
			clearInterval(di);
			clearInterval(ei);
			setTimeout(() => {
				if (document.hidden || silenced) {}
				else crash.play();
			}, 2e3);
		}
	}, 100);
}
function initiation() {
	if (!localStorage.initiation || localStorage.retraining) {
		if (document.querySelector("iframe")) {
			let a = document.querySelector("iframe");
			a.parentNode.removeChild(a);
		}
		document.querySelector(".screen").insertAdjacentHTML("afterbegin", "<div id='x'></div>");
		new YT.Player("x", {
			videoId: "UNFDHgjrlK8",
			playerVars: {
				autoplay: 1,
				modestbranding: 1,
				rel: 0,
				playsinline: 1,
				iv_load_policy: 3,
				origin: "https://www.youtube.com"
			},
			events: {
				"onStateChange": onPlayerStateChange
			}
		});
	}
	function onPlayerStateChange(event) {
		if (event.data === 0) {
			let a = document.querySelector("iframe");
			a.parentNode.removeChild(a);
			localStorage.initiation = "initiated";
		}
       }
}

function theend() {
	setTimeout(() => { m.innerHTML = "<span class='black'>𓋿</span>" }, 3e3);
	setTimeout(() => { m.innerHTML += "<span class='black'>𓏲</span>" }, 4e3);
	setTimeout(() => { m.innerHTML += "<span class='black'>𓍑</span>" }, 5e3);
	setTimeout(() => { s.innerHTML = "<span class='red'>𓅂</span>" }, 6e3);
	setTimeout(() => { s.innerHTML += "<span class='red'>𓏱</span>" }, 7e3);
	setTimeout(() => document.querySelector("main").classList.add("danger"), 10e3);
	setTimeout(() => {
		setInterval(() => document.getElementById("input").value += "System Failure ", 500);
	}, 14e3);
	setTimeout(() => {
		document.querySelector("main").style.opacity = 0;
		setInterval(() => {
			var r1 = Math.floor(Math.random() - 0.5) * 3;
			var r2 = Math.floor(Math.random() - 0.5) * 5;
			document.querySelector(".bg").style.marginTop = r1 + "em";
			document.querySelector(".bg").style.marginLeft = r2 + "em";
		}, 150);
	}, 19e3);
	setTimeout(() => {
		localStorage.removeItem("minute");
		localStorage.removeItem("second");
		localStorage.retraining = "mandatory";
		window.location.reload();
	}, 31e3);
}

function update() {
	ss--;
	if (ss < 0) {
		mm--;
		ss = 59;
		minutes();
	}
	if (mm <= 0 && ss <= 0) {
		clearInterval(si);
		theend();
	}
	if (mm <= -1) theend();
	seconds();
	localStorage.minute = mm;
	localStorage.second = ss;
};

function execute() {
	let a = document.getElementById("input");
	if (document.querySelector("main").classList.contains("danger")) return false;
	else if (a.value === "4 8 15 16 23 42") {
		if (mm < 4) {
			mm = 108;
			ss = 02;
			a.value = "";
			a.focus();
		} else {
			a.value = "Not yet";
			setTimeout(() => {
				a.value = "";
				a.focus();
			}, 4e3);
		}
	} else {
		a.value = "";
		a.focus();
	}
};

function silence() {
	if (silenced) {
		document.getElementById("silence").className = "silence";
		silenced = false;
	} else {
		document.getElementById("silence").className = "silenced";
		silenced = true;
	}
}
document.getElementById("go").addEventListener("click", (e) => {
	sounds();
	setTimeout(() => {
		minutes();
		seconds();
		si = setInterval(() => update(), 1e3);
		document.getElementById("input").focus();
		document.body.removeChild(document.getElementById("go"));
	}, 3e3);
	setTimeout(() => initiation(), 7e3);
});
document.getElementById("execute").addEventListener("click", () => execute());
document.querySelector(".monitor").addEventListener("click", () => document.getElementById("input").focus());
document.getElementById("silence").addEventListener("click", () => silence());
document.querySelector("i").addEventListener("click", (e) => {
	if (document.querySelector("main").classList.contains("danger")) return false;
	else if (e.shiftKey) {
		localStorage.clear();
		mm = 1;
		ss = 30;
		setTimeout(() => window.location.reload(), 1e3);
	} else {
		localStorage.retraining = "voluntary";
		initiation();
	}
});
setInterval(() => {
	if (!document.querySelector(".input:focus") && !document.querySelector("main").classList.contains("danger")) document.querySelector(".input").focus();
}, 100);
