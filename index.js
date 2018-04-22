module.exports = (text = ``, width = 0) => {
	const charset    = {
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
	      components = {
		      appendType: [`text`, `header`, `footer`],
		      tags: [`align`],
		      exceptedChars: [`\t`],
		      header: {
			      tlc: charset.corner.top.left.double,
			      trc: charset.corner.top.right.double,
			      blc: charset.corner.bottom.left.double,
			      brc: charset.corner.bottom.right.double,
			      lj: charset.joint.left.double,
			      rj: charset.joint.right.double,
		      },
		      defaultSettings: { width: 0, padding: 1 },
		      defaultOptions: { render: { dynamicWidth: true }, style: { weight: `single` } },
		
	      }
	
	
	let settings    = components.defaultSettings,
	    dialogMsg   = { text: `` },
	    dialogWidth = settings.width,
	    stdout      = []
	
	if(parseInt(process.versions.node) < 8) throw new Error(`ConsoleDialog require node.js version >= 8`)
	if(width) settings.width = width
	if(text) dialogMsg.text = text
	
	this.append = (msg, opt) => {
		opt = appendOptions(opt)
		if(typeof msg === `string`) msg = msg.split(`\n`)
		try {
			if(msg instanceof Array) {
				for(let i in msg) { msg[i] = `${opt.prefix || ``}${msg[i]}${opt.suffix || ``}` }
				msg = msg.join(`\n`)
			}
		}
		catch(e) { console.error(e) }
		
		if(components.appendType.indexOf(opt.type) > -1) {
			let payload = `${msg}\n`
			if(opt.append) payload = (dialogMsg[opt.type] || ``) + payload
			dialogMsg[opt.type] = payload
		} else console.error(`Could not append the message. type of appending is invalid.`)
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
			if(width === `dynamic`)  dialogWidth = 0
			else console.error(`Invalid width options.`)
		} else {
			if(typeof width === `string`) width = parseInt(width)
			if(width >= 0) settings.width = width? width: components.defaultSettings.width
			else console.error(`Box width must not less than 0.`)
		}
		
		
		return this
	}
	
	this.clear = () => {
		dialogMsg = { text: `` }
		dialogWidth = settings.width
		return this
	}
	
	this.reset = () => {
		settings = components.defaultSettings
		dialogMsg = { text: `` }
		dialogWidth = settings.width
		return this
	}
	
	this.render = (opt = {}) => {
		let msg = dialogMsg,
		    lineStyle
		
		if(msg.header || msg.footer) opt.weight = opt.weight === `double` ? `double` : undefined
		lineStyle = style(opt)
		
		if(isNaN(opt.width)) dialogWidth = settings.width? settings.width: components.defaultSettings.width
		else dialogWidth = typeof opt.width === `string`? parseInt(opt.width): opt.width
		if(typeof opt.width === `undefined`) opt.width = dialogWidth ? undefined : `dynamic`
		
		if(opt.width === `dynamic` || dialogWidth === 0) {
			let lines = [], width
			for(const label in msg) { lines = lines.concat(parse(msg[label], { autoNewLine: true })) }
			width = maxLength(lines)
			if(width >= dialogWidth) dialogWidth = width + 1
		}
		
		if(msg.header) {
			opt.type = `header`
			flush(msg.header, opt)
		} else stdout.push(`${lineStyle.tlc}${lineStyle.trc.padStart((dialogWidth + settings.padding * 2), lineStyle.hline)}`)
		
		flush(msg.text, opt)
		
		if(msg.footer) {
			opt.type = `footer`
			flush(msg.footer, opt)
		} else stdout.push(`${lineStyle.blc}${lineStyle.brc.padStart((dialogWidth + settings.padding * 2), lineStyle.hline)}`)
		
		let str = stdout.join(`\n`)
		stdout = []
		return str
	}
	
	const flush = (msg, opt = {}) => {
		const lines         = parse(msg),
		      lineStyle     = style(opt),
		      headerCharset = components.header,
		      hl            = { hline: charset.line.h.double },
		      s             = lineStyle.weight === `double` ? `both` : `h`
		
		for(let ls in headerCharset) { hl[ls] = headerCharset[ls][s] }
		switch(opt.type) {
			case `header`:
				delete opt.type
				stdout.push(`${hl.tlc}${hl.trc.padStart((dialogWidth + settings.padding * 2), hl.hline)}`)
				flush(msg, opt)
				stdout.push(`${hl.lj}${hl.rj.padStart((dialogWidth + settings.padding * 2), hl.hline)}`)
				break
			case `footer`:
				delete opt.type
				stdout.push(`${hl.lj}${hl.rj.padStart((dialogWidth + settings.padding * 2), hl.hline)}`)
				flush(msg, opt)
				stdout.push(`${hl.blc}${hl.brc.padStart((dialogWidth + settings.padding * 2), hl.hline)}`)
				break
			default:
				for(let line of lines) {
					switch(line) {
						case `::sep::`:
							stdout.push(`${lineStyle.lj}${lineStyle.rj.padStart((dialogWidth + settings.padding * 2), lineStyle.hline)}`)
							break
						default:
							if(line) {
								line = compile(line)
								const len = line.length, endPadding = dialogWidth - len
								stdout.push(`${lineStyle.vline} ${line} ${lineStyle.vline.padStart(endPadding)}`)
							}
							break
					}
				}
				break
		}
	}
	
	const parse = (msg, opt = {}) => {
		for(const char of components.exceptedChars) { msg = msg.replace(new RegExp(char, `g`), ``) }
		let lines = msg.split(`\n`), payload = []
		if(lines.length > 0 && lines[lines.length - 1] === ``) lines.splice(-1, 1)
		if(opt.autoNewLine) return lines
		for(let line of lines) {
				if(dialogWidth > 0 && compile(line, { remove: true }).length >= dialogWidth) {
					let strip = line.match(new RegExp(`.{1,${dialogWidth - 1}}`, `g`))
					payload = payload.concat(strip)
					continue
				}
			payload.push(line)
		}
		return payload
	}
	
	const compile = (msg, opt = {}) => {
		if(!msg) return msg
		for(const label of components.tags) {
			let tag = `::${label}::`, val
			
			if(msg.indexOf(tag) === -1) continue
			
			val = msg.split(tag)
			msg = msg.replace(new RegExp(`${tag}${val[1] ? val[1] : ``}${tag}`, `g`), ``)
			
			if(val.length < 3) continue
			if(opt.remove) continue
			
			val = val[1]
			switch(label) {
				case `align`:
					switch(val) {
						case `center`:
							let padding = Math.floor((dialogWidth - msg.length) / 2)
							if(dialogWidth > (padding + msg.length)) msg = msg.padStart(padding + msg.length)
							break
						case `right`:
							if(dialogWidth > msg.length) {
								let padding = (dialogWidth - msg.length) - 1
								msg = msg.padStart(padding + msg.length)
							}
							break
						default:
							break
					}
					break
				default:
					break
			}
		}
		return msg
	}
	
	const style = (opt = {}) => {
		let lineStyle = { weight: components.defaultOptions.style.weight }
		if(typeof opt === `object`) {
			if(Object.keys(charset.line.h).indexOf(opt.weight) > -1) lineStyle.weight = opt.weight
		}
		lineStyle.tlc = charset.corner.top.left[lineStyle.weight]
		lineStyle.trc = charset.corner.top.right[lineStyle.weight]
		lineStyle.blc = charset.corner.bottom.left[lineStyle.weight]
		lineStyle.brc = charset.corner.bottom.right[lineStyle.weight]
		lineStyle.hline = charset.line.h[lineStyle.weight]
		lineStyle.vline = charset.line.v[lineStyle.weight]
		lineStyle.lj = charset.joint.left[lineStyle.weight]
		lineStyle.rj = charset.joint.right[lineStyle.weight]
		
		if(lineStyle.weight === `single` && opt.corner === `round`) {
			lineStyle.tlc = charset.corner.top.left[opt.corner]
			lineStyle.trc = charset.corner.top.right[opt.corner]
			lineStyle.blc = charset.corner.bottom.left[opt.corner]
			lineStyle.brc = charset.corner.bottom.right[opt.corner]
		}
		
		if(lineStyle.weight === `double`) {
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
		if(typeof opt === `object`) {
			for(const k in opt) {
				switch(k) {
					case `align`:
						append.prefix += `::align::${opt[k]}::align::`
						break
					case `sep`:
						append.suffix += `\n::sep::`
						break
					case `type`:
						if(components.appendType.indexOf(opt[k]) > -1) append.type = opt[k]
						break
					case `append`:
						if(opt[k] === false) append.append = false
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
		for(const str of msg) {
			let rendered = compile(str, { remove: true })
			if(rendered.length > max) max = rendered.length
		}
		return max
	}
	
	return this
}