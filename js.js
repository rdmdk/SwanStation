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
	const ai = setInterval(() => {
		tick.volume = 0.25;
		if (document.hidden || silenced) {}
		else tick.play();
	}, 1e3);
	const bi = setInterval(() => {
		if (mm < 4) {
			beep.volume = 0.5;
			if (document.hidden || silenced) {}
			else beep.play();
		}
	}, 3e3);
	const ci = setInterval(() => {
		if (mm < 1) {
			clearInterval(bi);
			alarm.volume = 0.5;
			if (document.hidden || silenced) {}
			else alarm.play();
		}
	}, 4e3);
	const di = setInterval(() => {
		if (mm <= 0 && ss <= 10) {
			clearInterval(ci);
			alarm.volume = 0.75;
			if (document.hidden || silenced) {}
			else alarm.play();
		}
	}, 1e3);
	const ei = setInterval(() => {
		if (mm <= 0 && ss <= 0) {
			clearInterval(ai);
			clearInterval(di);
			clearInterval(ei);
			if (document.hidden || silenced) {}
			else crash.play();
		}
	}, 100);
}

function theend() {
	document.querySelector("main").classList.add("danger");
	document.querySelector("main").style.opacity = 0;
	setTimeout(() => {
		setInterval(() => {
			var r1 = Math.floor(Math.random() - 0.5) * 2;
			var r2 = Math.floor(Math.random() - 0.5) * 2;
			var r3 = Math.floor(Math.random() * 3) + 1;
			document.querySelector(".bg").style.marginTop = r1 + "em";
			document.querySelector(".bg").style.marginLeft = r2 + "em";
			document.querySelector(".bg").style.filter = "blur(" + r3 + "em)";
		}, 150);
	}, 5e3);
	setTimeout(() => {
		setInterval(() => document.getElementById("input").value += "System Failure ", 2e3);
	}, 12e3);
	setTimeout(() => {
		localStorage.removeItem("minute");
		localStorage.removeItem("second");
		window.location.reload();
	}, 30e3);
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
	if (a.value === "4 8 15 16 23 42") {
		if (mm < 4) {
			mm = 108;
			ss = 01;
			a.value = "";
			a.focus();
			if (document.querySelector(".danger")) document.querySelector(".danger").classList.remove("danger");
			document.querySelector(".bg").removeAttribute("style");
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
});
document.getElementById("execute").addEventListener("click", () => execute());
document.querySelector(".monitor").addEventListener("click", () => document.getElementById("input").focus());
document.getElementById("silence").addEventListener("click", () => silence());
document.querySelector("i").addEventListener("click", () => {
	localStorage.clear();
	mm = 4;
	ss = 10;
	setTimeout(() => window.location.reload(), 1e3);
});
setInterval(() => {
	if (!document.querySelector(".input:focus") && !document.querySelector("main").classList.contains("danger")) document.querySelector(".input").focus();
}, 100);
