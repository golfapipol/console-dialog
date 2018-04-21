module.exports = (text = ``,width = 0) => {
	const boxChars      = {
		      line: {
			      h: { single: `─`, bold: `━`, double: `═`, dash: `┄` },
			      v: { single: `│`, bold: `┃`, double: `║`, dash: `┆` },
		      },
		      corner: {
			      top: {
				      left: { single: `┌`, bold: `┏`, double: { h: `╒`, v: `╓`, both: `╔` }, round: `╭` },
				      right: { single: `┐`, bold: `┓`, double: { h: `╕`, v: `╖`, both: `╗` }, round: `╮` },
			      },
			      bottom: {
				      left: { single: `└`, bold: `┗`, double: { h: `╘`, v: `╙`, both: `╚` }, round: `╰` },
				      right: { single: `┘`, bold: `┛`, double: { h: `╛`, v: `╜`, both: `╝` }, round: `╯` },
			      },
		      },
		      joint: {
			      left: { single: `├`, bold: `┳`, double: { h: `╞`, v: `╟`, both: `╠` } },
			      right: { single: `┤`, bold: `┫`, double: { h: `╡`, v: `╢`, both: `╣` } },
			      top: { single: `┬`, bold: `┳`, double: { h: `╤`, v: `╥`, both: `╦` } },
			      bottom: { single: `┴`, bold: `┻`, double: { h: `╧`, v: `╨`, both: `╩` } },
			      middle: { single: `┼`, bold: `╋`, double: { h: `╪`, v: `╫`, both: `╬` } },
		      },
	      },
	      exceptedChars = [`\t`],
	      tags          = [`align`]
	
	let settings = {
			width: 0,
		    padding: 1,
		    appendType: [`text`, `header`, `footer`],
		    component: {
			    header: {
				    tlc: boxChars.corner.top.left.double,
				    trc: boxChars.corner.top.right.double,
				    blc: boxChars.corner.bottom.left.double,
				    brc: boxChars.corner.bottom.right.double,
				    lj: boxChars.joint.left.double,
				    rj: boxChars.joint.right.double,
			    },
		    },
			defaultOptions: {render: {dynamicWidth: true}, style: {weight: `single`}}
	    },
	    boxMsg   = { text: `` },
	    boxWidth = settings.width,
	    stdout = []
	
	if(parseInt(process.versions.node) < 8) throw new Error(`ConsoleDialog require node.js version >= 8`)
	if(width) settings.width = width
	if(text)  boxMsg.text = text
	
	this.append = (msg, opt) => {
		opt = appendOptions(opt)
		if(typeof msg == 'string') msg = msg.split(`\n`)
		try {
			if(msg instanceof Array) {
				for(let i in msg) { msg[i] = `${opt.prefix || ``}${msg[i]}${opt.suffix || ``}` }
				msg = msg.join(`\n`)
			}
		}
		catch(e) { console.error(e) }
		
		if(settings.appendType.indexOf(opt.type) > -1) {
			let payload = `${msg}\n`
			if(opt.append) payload = (boxMsg[opt.type] || ``) + payload
			boxMsg[opt.type] = payload
		}
		else
			console.error(`Could not append the message. type of appending is invalid.`)
		return this
	}
	
	this.header = (msg, opt = {}) => {
		opt.type = `header`
		opt.append = false
		this.append(msg, opt)
		return this
	}
	
	this.footer = (msg, opt = {}) => {
		opt.type = `footer`
		opt.append = false
		this.append(msg, opt)
		return this
	}
	
	this.width = (width) => {
		if(isNaN(width)) {
			console.error(`Box width must be a number`)
			return this
		} else width = parseInt(width)
		
		if(width > 0) settings.width = width
		else console.error(`Box width must be positive number and cannot be zero.`)
		return this
	}
	
	this.clear = () => {
		boxMsg = { text: `` }
		settings.width = 0
		return this
	}
	
	this.render = (opt = {}) => {
		let msg   = boxMsg,
		    lineStyle
		
		if(msg.header || msg.footer) opt.weight = opt.weight == `double`? `double`: undefined
		lineStyle = style(opt)
		
		boxWidth = settings.width
		if(typeof opt.dynamicWidth == `undefined`) opt.dynamicWidth = boxWidth? undefined: true
		
		if(opt.dynamicWidth) {
			let lines = [],  width = 0
			for(const label in msg) { lines = lines.concat(parse(msg[label], { autoNewLine: true })) }
			width = maxLength(lines)
			if(width >= boxWidth) boxWidth = width + 1
		}
		
		if(msg.header) {
			opt.type = `header`
			flush(msg.header, opt)
		} else stdout.push(`${lineStyle.tlc}${lineStyle.trc.padStart((boxWidth + settings.padding * 2), lineStyle.hline)}`)

		flush(msg.text, opt)
		
		if(msg.footer) {
			opt.type = `footer`
			flush(msg.footer, opt)
		} else stdout.push(`${lineStyle.blc}${lineStyle.brc.padStart((boxWidth + settings.padding * 2), lineStyle.hline)}`)
		
		let str = stdout.join(`\n`)
		stdout = []
		return str
	}
	
	const flush = (msg, opt = {}) => {
		const lines = parse(msg),
		      lineStyle = style(opt),
		      hl = { hline: boxChars.line.h.double }, s = lineStyle.weight == `double` ? `both` : `h`
		for(let ls in settings.component.header) { hl[ls] = settings.component.header[ls][s] }
		switch(opt.type) {
			case `header`:
				delete opt.type
				stdout.push(`${hl.tlc}${hl.trc.padStart((boxWidth + settings.padding * 2), hl.hline)}`)
				flush(msg, opt)
				stdout.push(`${hl.lj}${hl.rj.padStart((boxWidth + settings.padding * 2), hl.hline)}`)
				break
			case `footer`:
				delete opt.type
				stdout.push(`${hl.lj}${hl.rj.padStart((boxWidth + settings.padding * 2), hl.hline)}`)
				flush(msg, opt)
				stdout.push(`${hl.blc}${hl.brc.padStart((boxWidth + settings.padding * 2), hl.hline)}`)
				break
			default:
				for(let line of lines) {
					switch(line) {
						case `::sep::`:
							stdout.push(`${lineStyle.lj}${lineStyle.rj.padStart((boxWidth + settings.padding * 2), lineStyle.hline)}`)
							break
						default:
							line = compile(line)
							const len = line.length, endPadding = boxWidth - len
							stdout.push(`${lineStyle.vline} ${line} ${lineStyle.vline.padStart(endPadding)}`)
							break
					}
				}
				break
		}
	}
	
	const parse = (msg, opt = {}) => {
		for(const char of exceptedChars) { msg = msg.replace(new RegExp(char, `g`), ``) }
		let lines = msg.split(`\n`), payload = []
		if(lines.length > 0 && lines[lines.length - 1] == ``) lines.splice(-1, 1)
		if(opt.autoNewLine) return lines
		for(let line of lines) {
			if(compile(line, { remove: true }).length < boxWidth) {
				payload.push(line)
				continue
			}
			let strip = line.match(new RegExp(`.{1,${boxWidth - 1}}`, `g`))
			payload = payload.concat(strip)
		}
		return payload
	}
	
	const style = (opt = {}) => {
		let lineStyle = {weight: settings.defaultOptions.style.weight}
		if(typeof opt == `object`) {
			if(Object.keys(boxChars.line.h).indexOf(opt.weight) > -1) lineStyle = {weight: opt.weight}
		}
		lineStyle.tlc = boxChars.corner.top.left[lineStyle.weight]
		lineStyle.trc = boxChars.corner.top.right[lineStyle.weight]
		lineStyle.blc = boxChars.corner.bottom.left[lineStyle.weight]
		lineStyle.brc = boxChars.corner.bottom.right[lineStyle.weight]
		lineStyle.hline = boxChars.line.h[lineStyle.weight]
		lineStyle.vline = boxChars.line.v[lineStyle.weight]
		lineStyle.lj = boxChars.joint.left[lineStyle.weight]
		lineStyle.rj = boxChars.joint.right[lineStyle.weight]
		
		if(lineStyle.weight == `single` && opt.corner == `round`) {
			lineStyle.tlc = boxChars.corner.top.left[opt.corner]
			lineStyle.trc = boxChars.corner.top.right[opt.corner]
			lineStyle.blc = boxChars.corner.bottom.left[opt.corner]
			lineStyle.brc = boxChars.corner.bottom.right[opt.corner]
		}
		
		if(lineStyle.weight == `double`) {
			lineStyle.tlc = lineStyle.tlc.both
			lineStyle.trc = lineStyle.trc.both
			lineStyle.blc = lineStyle.blc.both
			lineStyle.brc = lineStyle.brc.both
			lineStyle.lj = lineStyle.lj.both
			lineStyle.rj = lineStyle.rj.both
		}
		return lineStyle
	}
	
	const appendOptions = (opt) => {
		let append = { type: `text`, append: true, prefix: ``, suffix: `` }
		if(typeof opt == 'object') {
			for(const k in opt) {
				switch(k) {
					case `align`:
						append.prefix += `::align::${opt[k]}::align::`
						break
					case `sep`:
						append.suffix += `\n::sep::`
						break
					case `type`:
						if(settings.appendType.indexOf(opt[k]) > -1) append.type = opt[k]
						break
					case `append`:
						if(opt[k] == false) append.append = false
						break
					default:
						break
				}
			}
		}
		return append
	}
	
	const maxLength = (msg) => {
	    let max = 0
	    for (const str of msg) {
	        let rendered = compile(str, { remove: true })
	        if (rendered.length > max) max = rendered.length
	    }
	    return max
	}
	
	const compile = (msg, opt = {}) => {
	    for (const label of tags) {
	        let tag = `::${label}::`, val
	        
		    if (msg.indexOf(tag) == -1) continue
	     
		    val = msg.split(tag)
	        msg = msg.replace(new RegExp(`${tag}${val[1] ? val[1] : ``}${tag}`, `g`), ``)
	        
		    if (val.length < 3) continue
	        if (opt.remove) continue
	        
		    val = val[1]
	        switch (label) {
	            case `align`:
	                switch (val) {
	                    case `center`:
	                        let padding = Math.floor((boxWidth - msg.length) / 2)
	                        if (boxWidth > (padding + msg.length)) msg = msg.padStart(padding + msg.length)
	                        break
	                    case `right`:
	                        if (boxWidth > msg.length) {
	                            let padding = (boxWidth - msg.length) - 1
	                            msg = msg.padStart(padding + msg.length)
	                        }
	                        break
	                    default: break
	                }
	                break
	            default: break
	        }
	    }
	    return msg
	}
	
	return this
}