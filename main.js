const e = Math.E
const pi = Math.PI

class Special {

	constructor() {
		this.cin = '<span class="cin">≫</span>'
		this.cout = '<span class="cout">≪</span>'
		this.field = document.querySelector('#commandfield')
		this.output = document.querySelector('.output')
		this.consol = document.querySelector('.console')
		this.enter = document.querySelector('.enter')
	}

	outconsole(str) {
		this.output.innerHTML += `<p>${str}</p>`
	}

}

let sp = new Special()

window.addEventListener('keypress', e => {
	if (e.which == 13)
		checkInput()
})

window.addEventListener('keydown', e => {

	if (e.which == 38) {
		currentPosition = currentPosition - 1 < 0 ? history.length - 1 : currentPosition - 1
		getFromHistory()
	} else if (e.which == 40) {
		currentPosition = currentPosition + 1 > history.length ? 0 : currentPosition + 1
		getFromHistory()
	}

})

window.addEventListener('load', () => {
	sp.enter.style['top'] = sp.field.offsetTop + 'px'
})

window.addEventListener('resize', () => {
	sp.enter.style['top'] = sp.field.offsetTop + 'px'
})

let currentPosition = -1
let history = []

let commandsList = ['help', 'clrscr', 'clrhistory', 'sayhi', 'info', 'usersinfo', 'getrandomcolor']
let mathFunctions = ['round', 'ceil', 'floor', 'sin', 'cos', 'abs', 'acos', 'asin', 'atan', 'tan', 'log']

function checkInput() {

	let val = sp.field.value
	sp.field.value = ''

	currentPosition = -1

	if (val != '') {
		history.push(val)

		if (val[0] == '$') {

			try {
				let answer = val.substr(1).replace(/ /g, '').toLowerCase()

				if (mathFunctions.includes(answer.substr(0, answer.indexOf('(')))) {
					sp.outconsole(sp.cin + answer.substr(0, answer.indexOf('(')) + '(' + answer.substr(answer.indexOf('(') +
						1, answer.indexOf(')') - 1))
					sp.outconsole(sp.cout + eval(answer))
				} else {
					if (commandsList.includes(answer))
						answer += '()'
					eval(answer)

					if (answer.search(/[=]/) != -1)
						sp.outconsole(sp.cout + answer.substr(0, answer.search(/[=]/) + 1) +
							eval(answer.substr(answer.search(/[=]/) + 1)))
				}

			} catch (err) {
				sp.outconsole(`${sp.cout}<span class="err">${err.name}</span><br>${err.message}`)
			}

		} else if (val.search(/[+-/\*%&|~<>\^]/) != -1) {

			try {
				let answer = eval(val)

				sp.outconsole(`${sp.cin}<span class="clickable" onclick="javascript:void(sp.field.value = 
					this.innerHTML)">${val}</span>`)
				sp.outconsole(`${sp.cout}<span class="clickable" onclick="javascript:void(sp.field.value = 
					this.innerHTML)">${answer}</span>`)
			} catch (err) {
				sp.outconsole(`${sp.cout}<span class="err">${err.name}</span><br>${err.message}`)
			}

		} else if (val.replace(/ /g, '').toLowerCase() == 'whatdouknowaboutme?' ||
			val.replace(/ /g, '').toLowerCase() == 'whatdoyouknowaboutme?') {
			sp.outconsole(sp.cin + '<span class="clickable" onclick="javascript:void(sp.field.value = this.innerHTML)">' +
				val + '</span>')
			usersinfo('Not so much...')
		} else
			sp.outconsole(sp.cin + val)

	}

	sp.consol.scrollTop = sp.field.offsetTop
	sp.enter.style['top'] = sp.field.offsetTop + 'px'

}

function getFromHistory() {
	sp.field.value = history[currentPosition] == undefined ? '' : history[currentPosition]
}

function clrscr() {
	sp.output.innerHTML = '<p>Cleaned</p>'
}

function clrhistory() {
	history = []
	sp.outconsole('History cleaned')
}

function sayhi() {
	sp.outconsole(`${sp.cout} Hello World!`)
}

function help() {

	sp.outconsole(`${sp.cout} Use $ to call next commands: <br>
	<span class="clickable" onclick="javascript:void(sp.field.value = '$' + this.innerHTML)" title="Add 
	to command line">help</span> - show all commands <br>
	<span class="clickable" onclick="javascript:void(sp.field.value = '$' + this.innerHTML)" title="Add 
	to command line">clrscr</span> - clear screen <br>
	<span class="clickable" onclick="javascript:void(sp.field.value = '$' + this.innerHTML)" title="Add 
	to command line">clrhistory</span> - clear commands history <br>
	<span class="clickable" onclick="javascript:void(sp.field.value = '$' + this.innerHTML)" title="Add 
	to command line">sayhi</span> - says Hello <br>
	<span class="clickable" onclick="javascript:void(sp.field.value = '$' + this.innerHTML)" title="Add 
	to command line">usersinfo</span> - get info about user <br>
	<span class="clickable" onclick="javascript:void(sp.field.value = '$' + this.innerHTML)" title="Add 
	to command line">getrandomcolor</span> - get random color <br>
	<span class="clickable" onclick="javascript:void(sp.field.value = '$' + this.innerHTML)" title="Add 
	to command line">solve</span> - solve the equation, check <span class="clickable" onclick="javascript:void(sp.field.value = this.innerHTML)" title="Add to command 
	line">$info(2)</span> to get more information`)

}

function info(number = 0) {

	switch (number) {
		case 1:
			sp.outconsole(`${sp.cout}Math module: <br>
			You can use default math operations like +, -, /, *, %, **. <br>
			Also you can use logical operators: &, |, >>>, <<<. <br>
			Avaiable math functions: round, floor, ceil, sin, cos, asin, acos, tan, atan, abs, log.
			You can call them by using $.
			Example: $ <span class="clickable" onclick="javascript:void(sp.field.value = '$' + this.innerHTML)">
			round(4.5)</span> // output 5 <br>
			Constans: pi = ${pi}, e = ${e}`)
			break

		case 2:
			sp.outconsole(`${sp.cout}Solve module: <br>
				Use $ to call solve function. First argument is equation that you need to solve, put it into '' or "".
				Also, you can give to this function some optional parameters:
				lower and upper ranges to check values; step, small step will give you more accuracy, 
				but will spend more time.`)
			break

		default:
			sp.outconsole(`${sp.cout}Information: <br>
			The first thing you should know - this instrument is interpreter of JavaScript. <br>
			You can use special symbol $ to call commands from <span class="clickable" 
			onclick="javascript:void(sp.field.value = this.innerHTML)">$help</span> list. <br>
			Also you can use JavaScript syntax to operate variables. 
			Just write <span class="clickable" onclick="javascript:void(sp.field.value = this.innerHTML)">
			$h = 4</span>, and then h will be equal to 4 and you can use it after.
			You can do math operations in command line. <br> Addition modules: <br>
			<span class="clickable" onclick="javascript:void(sp.field.value = this.innerHTML)" title="Add to command 
			line">$info(1)</span> - Math module <br>
			<span class="clickable" onclick="javascript:void(sp.field.value = this.innerHTML)" title="Add to command 
			line">$info(2)</span> - Solve module`)
			break
	}

}

function usersinfo(string = 'All, I know about you:') {

	sp.outconsole(`${sp.cout + string}<br>
	Width X Height of your window: ${window.innerWidth}px X ${window.innerHeight}px <br>
	Width X Height of your screen: ${screen.width}px X ${screen.height}px <br>
	Color depth of your screen: ${screen.colorDepth} <br>
	Pixel depth of your screen: ${screen.pixelDepth}px <br>
	You default language is ${navigator.language} <br>
	That's all, I hope you liked my power :)`)

}

function getrandomcolor() {

	let color = ''

	for (let i = 0; i < 3; i++) {
		let variable = Math.floor(Math.random() * 256).toString(16)
		variable = variable.length == 1 ? 0 + variable : variable
		color += variable
	}

	sp.outconsole(`${sp.cout} What about this one? 
	<span class="color-block" style="background-color: #${color}"></span> 
	<span class="clickable" onclick="copyText(this.innerHTML)" title="Click to copy">${color}</span>`)

}

function round(num = 0) {
	return Math.round(num)
}

function ceil(num = 0) {
	return Math.ceil(num)
}

function floor(num = 0) {
	return Math.floor(num)
}

function sin(num = 0) {
	return Math.sin(num)
}

function cos(num = 0) {
	return Math.cos(num)
}

function abs(num = 0) {
	return Math.abs(num)
}

function acos(num = 0) {
	return Math.acos(num)
}

function asin(num = 0) {
	return Math.asin(num)
}

function atan(num = 0) {
	return Math.atan(num)
}

function tan(num = 0) {
	return Math.tan(num)
}

function log(num = 0, base = e) {
	return Math.log(num) / Math.log(base)
}

function copyText(str) {
	navigator.clipboard.writeText(str)
}

function solve(str, lowerRange = -10, upperRange = 10, step = .1) {

	sp.outconsole(`${sp.cin}Solves of equation ${str} = 0 on the interval from 
		${lowerRange} to ${upperRange} with step = ${step}:`)

	function f(x) {
		return eval(str)
	}

	function check(a, b, e) {
		if (b - a >= e) {
			let c = (a + b) / 2
			if (f(a) * f(c) < 0)
				check(a, c, e)
			else
				check(c, b, e)
		} else if (f(round(a)) == 0)
			sp.outconsole(`${sp.cout + round(a)}`)
		else
			sp.outconsole(`${sp.cout + a} Approximate value: ${round(a)}`)
	}

	while (lowerRange < upperRange) {
		let anotherRange = lowerRange + step
		if (f(lowerRange) * f(anotherRange) < 0)
			check(lowerRange, anotherRange, .00001)
		lowerRange = anotherRange
	}

}