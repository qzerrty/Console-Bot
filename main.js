const field = document.querySelector('#commandfield')
const output = document.querySelector('.output')
const consol = document.querySelector('.console')
const enter = document.querySelector('.enter')
const e = Math.E
const pi = Math.PI

const cin = '<span class="cin">≫</span>'
const cout = '<span class="cout">≪</span>'

window.addEventListener('keypress', e => {
	if (e.which == 13)
		checkInput()
})

window.addEventListener('keydown', e => {
	if (e.which == 38) {
		currentPosition = currentPosition - 1 < 0 ? history.length - 1 : currentPosition - 1
		getFromHistory()
	}
	else if (e.which == 40) {
		currentPosition = currentPosition + 1 > history.length ? 0 : currentPosition + 1
		getFromHistory()
	}
})

window.addEventListener('load', () => {
	enter.style['top'] = field.offsetTop + 'px'
})

window.addEventListener('resize', () => {
	enter.style['top'] = field.offsetTop + 'px'
})

let currentPosition = -1
let history = []

let commandsList = ['help', 'clrscr', 'clrhistory', 'sayhi', 'info', 'usersinfo', 'getrandomcolor']
let mathFunctions = ['round', 'ceil', 'floor', 'sin', 'cos', 'abs', 'acos', 'asin', 'atan', 'tan']

function checkInput() {
	let val = field.value
	field.value = ''

	currentPosition = -1

	if (val != '') {
		history.push(val)

		 if (val[0] == '$') {

			try {
				let answer = val.substr(1).replace(/ /g, '').toLowerCase()

				if (mathFunctions.includes(answer.substr(0, answer.indexOf('(')))) {
					output.innerHTML += `<p>${cin + answer.substr(0, answer.indexOf('('))}(${answer.substr(answer.indexOf('(') + 1, answer.indexOf(')') - 1)}</p>`
					output.innerHTML += `<p>${cout}${eval(answer)}</p>`
				} else {
					if (commandsList.includes(answer))
						answer += '()'
					eval(answer)

					if (answer.search(/[=]/) != -1)
						output.innerHTML += `<p>${cout + answer.substr(0, answer.search(/[=]/) + 1) + eval(answer.substr(answer.search(/[=]/) + 1))}</p>`
				}

			} catch (err) {
				output.innerHTML += `<p>${cout + '<span class="err">' + err.name + '</span>' + '<br>' + err.message}</p>`
			}

		} else if (val.search(/[+-/\*%&|~<>\^]/) != -1) {

			try {
				let answer = eval(val)

				output.innerHTML += `<p>${cin}<span class="clickable" onclick="javascript:void(field.value = this.innerHTML)">${val}</span></p>`
				output.innerHTML += `<p>${cout}<span class="clickable" onclick="javascript:void(field.value = this.innerHTML)">${answer}</span></p>`
			} catch (err) {
				output.innerHTML += `<p>${cout + '<span class="err">' + err.name + '</span>' + '<br>' + err.message}</p>`
			}

		} else if (val.replace(/ /g,'').toLowerCase() == 'whatdouknowaboutme?' || val.replace(/ /g,'').toLowerCase() == 'whatdoyouknowaboutme?') {
			output.innerHTML += `<p>${cin}<span class="clickable" onclick="javascript:void(field.value = this.innerHTML)">${val}</span></p>`
			usersinfo('Not so much...')
		}
		else
			output.innerHTML += `<p>${cin + val}</p>`

	}

	consol.scrollTop = field.offsetTop
	enter.style['top'] = field.offsetTop + 'px'
}

function getFromHistory() {
	field.value = history[currentPosition] == undefined ? '' : history[currentPosition]
}

function clrscr() {
	output.innerHTML = '<p>Cleaned</p>'
}

function clrhistory() {
	history = []
	output.innerHTML += '<p>History cleaned</p>'
}

function sayhi() {
	output.innerHTML += '<p>' + cout + 'Hello World!</p>'
}

function help() {
	output.innerHTML += `<p>${cout}Use $ to call next commands: <br>
	<span class="clickable" onclick="javascript:void(field.value = '$' + this.innerHTML)" title="Add to command line">help</span> - show all commands <br>
	<span class="clickable" onclick="javascript:void(field.value = '$' + this.innerHTML)" title="Add to command line">clrscr</span> - clear screen <br>
	<span class="clickable" onclick="javascript:void(field.value = '$' + this.innerHTML)" title="Add to command line">clrhistory</span> - clear commands history <br>
	<span class="clickable" onclick="javascript:void(field.value = '$' + this.innerHTML)" title="Add to command line">sayhi</span> - says Hello <br>
	<span class="clickable" onclick="javascript:void(field.value = '$' + this.innerHTML)" title="Add to command line">usersinfo</span> - get info about user <br>
	<span class="clickable" onclick="javascript:void(field.value = '$' + this.innerHTML)" title="Add to command line">getrandomcolor</span> - get random color
	</p>`
}

function info(number = 0) {
	switch(number) {
		case 1:
			output.innerHTML += `<p>${cout}Math module: <br>
			You can use default math operations like +, -, /, *, %, **. <br>
			Also you can use logical operators: &, |, >>>, <<<. <br>
			Avaiable math functions: round, floor, ceil, sin, cos, asin, acos, tan, atan, abs. You can call them by using $.
			Example: $ <span class="clickable" onclick="javascript:void(field.value = '$' + this.innerHTML)">round(4.5)</span> // output 5 <br>
			Constans: pi = ${pi}, e = ${e} <br>
			</p>`
			break
		default:
			output.innerHTML += `<p>${cout}Information: <br>
			The first thing you should know - this instrument is interpreter of JavaScript. <br>
			You can use special symbol $ to call commands from <span class="clickable" onclick="javascript:void(field.value = this.innerHTML)">$help</span> list. <br>
			Also you can use JavaScript syntax to operate variables. 
			Just write <span class="clickable" onclick="javascript:void(field.value = this.innerHTML)">$h = 4</span>, 
			and then h will be equal to 4 and you can use it after.
			You can do math operations in command line. <br>
			Addition modules: <br>
			<span class="clickable" onclick="javascript:void(field.value = this.innerHTML)" title="Add to command line">$info(1)</span> - Math module
			</p>`
			break
	}
}

function usersinfo(string = 'All, I know about you:') {
	output.innerHTML += `<p>${cout + string}<br>
	Width X Height of your window: ${window.innerWidth}px X ${window.innerHeight}px <br>
	Width X Height of your screen: ${screen.width}px X ${screen.height}px <br>
	Color depth of your screen: ${screen.colorDepth} <br>
	Pixel depth of your screen: ${screen.pixelDepth}px <br>
	You default language is ${navigator.language} <br>
	That's all, I hope you liked my power :)
	</p>`
}

function getrandomcolor() {
	let color = ''

	for (let i = 0; i < 3; i++) {
		let variable = Math.floor(Math.random() * 256).toString(16)
		variable = variable.length == 1 ? 0 + variable : variable
		color += variable
	}

	output.innerHTML += `<p>${cout} What about this one? 
	<span class="color-block" style="background-color: #${color}"></span> 
	<span class="clickable" onclick="copyText(this.innerHTML)" title="Click to copy">${color}</span></p>`
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

function copyText(str) {
	navigator.clipboard.writeText(str)
}

function solve(str) {

	output.innerHTML += `<p>${cin + str}</p>`

	function f(x) {
		return eval(str)
	}

	function check(a, b, e) {
		if (b - a >= e) {
			let c = (a + b) / 2
			if (f(a) * f(c) < 0)
				check(a, c, e)
			else
				check(c,b,e)
		} else
			output.innerHTML += `<p>${cout + a} Approximate value: ${round(a)}</p>`
	}

	let a = -1000, b = 1000, h = 0.1
	while (a < b) {
		let z = a + h
		if (f(a) * f(z) < 0)
			check(a, z, 0.00001)
		a = z
	}
}