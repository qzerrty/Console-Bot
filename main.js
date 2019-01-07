// declaration math constants
const e = Math.E
const pi = Math.PI
// creating class for special functions and variables
class Special {

	constructor() {
		this.cin = '<span class="cin">≫</span>'
		this.cout = '<span class="cout">≪</span>'
		this.field = document.querySelector('#commandfield')
		this.output = document.querySelector('.output')
		this.consol = document.querySelector('.console')
		this.enter = document.querySelector('.enter')
		this.lastOutput = ''
	}

	outconsole(str, additionStr = '') {
		this.output.innerHTML += `<p>${str}</p>`
		this.lastOutput = additionStr
	}

	printArray(array) {
		let print = `<div class="closeable">${this.cout}
		<label><input type="checkbox" onclick="checkClose(this)">
		<span class="clickable" title="Click to open/close">Array</span></label> [
		<div class="closeit">`

		for (let index in array)
			print += `<p>${array[index]},</p>`

		print += '</div>]</div>'
		this.output.innerHTML += print
	}

}

let sP = new Special()

window.addEventListener('keypress', e => {
	// enter listener
	if (e.which == 13)
		checkInput()

	if (sP.field.value.replace(/ /g, '').search(/[+-/\*%&|~<>\^]/) == 0) {
		sP.field.value = sP.lastOutput + sP.field.value
	}
})

window.addEventListener('keydown', e => {
	// arrows listener
	if (e.which == 38) {
		currentPosition = currentPosition - 1 < 0 ? history.length - 1 : currentPosition - 1
		getFromHistory()
	} else if (e.which == 40) {
		currentPosition = currentPosition + 1 > history.length ? 0 : currentPosition + 1
		getFromHistory()
	}

})

window.addEventListener('load', () => {
	sP.enter.style['top'] = sP.field.offsetTop + 'px'
})

window.addEventListener('resize', () => {
	sP.enter.style['top'] = sP.field.offsetTop + 'px'
})

let currentPosition = -1
let history = []

let commandsList = ['help', 'clrscr', 'clrhistory', 'sayhi',
	'info', 'usersinfo', 'getrandomcolor'
]
let functionsWithParams = ['round', 'ceil', 'floor', 'sin', 'cos', 'abs', 'acos',
	'asin', 'atan', 'tan', 'log', 'getdiveders', 'nod', 'nok'
]

function checkInput() {

	let val = sP.field.value
	sP.field.value = ''

	currentPosition = -1

	if (val != '') {
		history.push(val)

		if (val[0] == '$') {

			try {
				let answer = val.substr(1).toLowerCase() // deleting $

				while (answer.indexOf('  ') != -1)
					answer = answer.replace(/  /g, ' ') // removing useless double spaces

				if (answer.indexOf('\'') != -1) { // removing all spaces from expression
					let fun = answer.substr(answer.indexOf('\''), answer.lastIndexOf('\'') - answer.indexOf('\'') + 1)
					let fun2 = fun

					while (fun.indexOf(' ') != -1)
						fun = fun.replace(/ /g, '')

					answer = answer.substr(0, answer.indexOf('\'')) + fun + answer.substr(answer.lastIndexOf('\'') + 1)
				}

				if (answer.search(/[=]/) != -1) { // simple expression solver
					sP.outconsole(sP.cout + answer.substr(0, answer.search(/[=]/) + 1) +
						eval(answer.substr(answer.search(/[=]/) + 1)))
					eval(answer)
				} else {
					answer = answer.substr(answer.search(/[a-zA-Z]/)).split(' ').filter(word => word != '')

					if (functionsWithParams.includes(answer[0])) {
						if (answer[0] == 'log') {
							sP.outconsole(`${sP.cin + answer[0]}<sub>${(answer[2] || '')}</sub>(${answer[1] || 0})`)
							let outputLine = eval(`${answer[0]}(${answer[1] || 0}, ${answer[2] || e})`)
							sP.outconsole(`${sP.cout}<span class="clickable" onclick="javascript:void(sP.field.value =
								this.innerHTML)">${outputLine}</span>`, outputLine)
						} else if (answer[0] == 'nod' || answer[0] == 'nok') {
							sP.outconsole(`${sP.cin + answer[0]}(${answer[1] || 1},${(answer[2] || 1)})`)
							let outputLine = eval(`${answer[0]}(${answer[1] || 1}, ${answer[2] || 1})`)
							sP.outconsole(`${sP.cout}<span class="clickable" onclick="javascript:void(sP.field.value =
								this.innerHTML)">${outputLine}</span>`, outputLine)
						} else if (answer[0] == 'getdiveders') {
							sP.outconsole(`${sP.cin + answer[0]}(${answer[1] || 0})`)
							getdiveders(answer[1] || 0)
						} else {
							sP.outconsole(`${sP.cin + answer[0]}(${answer[1] || 0})`)
							sP.outconsole(sP.cout + eval(`${answer[0]}(${answer[1] || 0})`))
						}
					} else
					if (answer[0] == 'solve')
						eval(`${answer[0]}(${answer[1]},${answer[2] || -10},${answer[3] || 10},${answer[4] || .1})`)
					else if (answer[0] == 'info')
						eval(`${answer[0]}(${answer[1] || 0})`)
					else {
						if (commandsList.includes(answer[0]))
							answer[0] += '()'
						eval(answer[0])
					}
				}
			} catch (err) {
				sP.outconsole(`${sP.cout}<span class="err">${err.name}</span><br>${err.message}`)
			}

		} else if (val.search(/[+-/\*%&|~<>\^]/) != -1) {

			try {
				let answer = eval(val)

				sP.outconsole(`${sP.cin}<span class="clickable" onclick="javascript:void(sP.field.value =
					this.innerHTML)">${val}</span>`)
				sP.outconsole(`${sP.cout}<span class="clickable" onclick="javascript:void(sP.field.value =
					this.innerHTML)">${answer}</span>`, answer)
			} catch (err) {
				sP.outconsole(`${sP.cout}<span class="err">${err.name}</span><br>${err.message}`)
			}

		} else if (val.replace(/ /g, '').toLowerCase() == 'whatdouknowaboutme?' ||
			val.replace(/ /g, '').toLowerCase() == 'whatdoyouknowaboutme?') {
			sP.outconsole(sP.cin + '<span class="clickable" onclick="javascript:void(sP.field.value = this.innerHTML)">' +
				val + '</span>')
			usersinfo('Not so much...')
		} else
			sP.outconsole(sP.cin + val)

	}

	sP.consol.scrollTop = sP.field.offsetTop
	sP.enter.style['top'] = sP.field.offsetTop + 'px'

}

function getFromHistory() {
	sP.field.value = history[currentPosition] == undefined ? '' : history[currentPosition]
}

function clrscr() {
	sP.output.innerHTML = '<p>Cleaned</p>'
}

function clrhistory() {
	history = []
	sP.outconsole('History cleaned')
}

function help() {

	sP.outconsole(`${sP.cout} Use $ to call next commands: <br>
	<span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
	title="Add to command line">help</span> - shows all commands <br>

	<span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
	title="Add to command line">info</span> - information about project <br>

	<span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
	title="Add to command line">clrscr</span> - clear screen <br>

	<span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
	title="Add to command line">clrhistory</span> - clear commands history <br>

	<span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
	title="Add to command line">sayhi</span> - says Hello <br>

	<span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
	title="Add to command line">usersinfo</span> - get info about user <br>

	<span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
	title="Add to command line">getrandomcolor</span> - get random color <br>

	<span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
	title="Add to command line">solve</span> - solves the equation, check <span class="clickable"
	onclick="javascript:void(sP.field.value = this.innerHTML)" title="Add to command
	line">$info 2</span> to get more information`)

}

function info(number = 0) {

	switch (number) {
		case 1:
			sP.outconsole(`${sP.cout}Math module: <br>
			You can use default math operations like +, -, /, *, %, **. <br>
			Also you can use logical operators: &, |, >>>, <<<. <br>
			Avaiable math functions: round, floor, ceil, sin, cos, asin, acos, tan, atan, abs, log.
			You can call them by using $.
			Example: $ <span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
			>round 4.5</span> // output 5 <br>
			Constans: pi = ${pi}, e = ${e}`)
			break

		case 2:
			sP.outconsole(`${sP.cout}Solve module: <br>
				Use $ to call solve function. First argument is equation that you need to solve, put it into '' or "".
				Also, you can give to this function some optional parameters:
				lower and upper ranges to check values; step, small step will give you more accuracy,
				but will sPend more time. <br>
				Example: $ <span class="clickable" onclick="javascript:void(sP.field.value = '$' + this.innerHTML)"
				>solve 'x-1'</span>`)
			break

		default:
			sP.outconsole(`${sP.cout}Information: <br>
			The first thing you should know - this instrument is interpreter of JavaScript. <br>
			You can use sPecial symbol $ to call commands from <span class="clickable"
			onclick="javascript:void(sP.field.value = this.innerHTML)">$help</span> list. <br>
			Also you can use JavaScript syntax to operate variables.
			Just write <span class="clickable" onclick="javascript:void(sP.field.value = this.innerHTML)">$h = 4</span>
			, and then h will be equal to 4 and you can use it after.
			You can do math operations in command line. <br> Addition modules: <br>
			<span class="clickable" onclick="javascript:void(sP.field.value = this.innerHTML)" title="Add to command
			line">$info 1</span> - Math module <br>
			<span class="clickable" onclick="javascript:void(sP.field.value = this.innerHTML)" title="Add to command
			line">$info 2</span> - Solve module`)
			break
	}

}

function usersinfo(string = 'All, I know about you:') {

	sP.outconsole(`${sP.cout + string}<br>
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

	sP.outconsole(`${sP.cout} What about this one?
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

function getdiveders(input) {

	let output = []
	for (let i = 1; i < Math.ceil(input ** 0.5); i++)
		if (input % i == 0) {
			output.push(i)
			output.push(input / i)
		}
	if (Math.ceil(input ** 0.5) ** 2 == input)
		output.push(Math.ceil(input ** 0.5))

	sP.printArray(output.sort( (x, y) => {return x - y}))
}

function nod(a, b) {
	while (a != 0 && b != 0) {
		if (a > b)
        a %= b
    else
        b %= a
	}

	return a + b
}

function nok(a, b) {
	return a * b / nod(a, b)
}

function copyText(str) {
	navigator.clipboard.writeText(str)
}

function sayhi() {
	sP.outconsole(`<img src="logobot.png" alt="console-bot"><br>Hi, my name is Johny!`)
}

function solve(str, lowerRange = -10, upperRange = 10, step = .1) {

	let answers = []
	sP.outconsole(`${sP.cin}Solves of equation ${str} = 0 on the interval from
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
			answers.push(round(a))
		else
			answers.push(`${a} Approximate value: ${round(a)}`)
	}

	while (lowerRange < upperRange) {
		let anotherRange = lowerRange + step
		if (f(lowerRange) * f(anotherRange) < 0)
			check(lowerRange, anotherRange, .00001)
		lowerRange = anotherRange
	}

	sP.printArray(answers)

}

function checkClose(element) {
	if (element.checked)
		element.parentNode.parentNode.childNodes[4].style['display'] = 'none'
	else
		element.parentNode.parentNode.childNodes[4].style['display'] = 'block'
	sP.consol.scrollTop = sP.field.offsetTop
	sP.enter.style['top'] = sP.field.offsetTop + 'px'
}

//This is the "Offline copy of pages" service worker

//Add this below content to your HTML page, or add the js file to your page at the very top to register service worker
// if (navigator.serviceWorker.controller) {
//   console.log('[PWA Builder] active service worker found, no need to register')
// } else {
//   //Register the ServiceWorker
//   navigator.serviceWorker.register('pwabuilder-sw.js', {
//     scope: './'
//   }).then(function(reg) {
//     console.log('Service worker has been registered for scope:'+ reg.scope);
//   });
// }
